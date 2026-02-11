import { sql } from "kysely";
import { createDb } from "./client";

const db = createDb();

async function seed() {
  console.log("Seeding database...");

  // Clean existing data in reverse dependency order
  await sql`TRUNCATE center_results, centers, candidates, constituencies, parties, districts, scrape_log RESTART IDENTITY CASCADE`.execute(db);
  console.log("Cleared existing data");

  // Districts
  const districts = await db
    .insertInto("districts")
    .values([
      { ec_zilla_id: 1, name_bn: "ঢাকা", name_en: "Dhaka", slug: "dhaka" },
      { ec_zilla_id: 2, name_bn: "চট্টগ্রাম", name_en: "Chattogram", slug: "chattogram" },
      { ec_zilla_id: 3, name_bn: "রাজশাহী", name_en: "Rajshahi", slug: "rajshahi" },
      { ec_zilla_id: 4, name_bn: "খুলনা", name_en: "Khulna", slug: "khulna" },
      { ec_zilla_id: 5, name_bn: "সিলেট", name_en: "Sylhet", slug: "sylhet" },
      { ec_zilla_id: 6, name_bn: "বরিশাল", name_en: "Barishal", slug: "barishal" },
      { ec_zilla_id: 7, name_bn: "রংপুর", name_en: "Rangpur", slug: "rangpur" },
      { ec_zilla_id: 8, name_bn: "ময়মনসিংহ", name_en: "Mymensingh", slug: "mymensingh" },
    ])
    .returningAll()
    .execute();
  console.log(`Seeded ${districts.length} districts`);

  // Parties
  const parties = await db
    .insertInto("parties")
    .values([
      { name_bn: "বাংলাদেশ আওয়ামী লীগ", name_en: "Bangladesh Awami League", short_name: "AL", slug: "awami-league" },
      { name_bn: "বাংলাদেশ জাতীয়তাবাদী দল", name_en: "Bangladesh Nationalist Party", short_name: "BNP", slug: "bnp" },
      { name_bn: "জাতীয় পার্টি", name_en: "Jatiya Party", short_name: "JP", slug: "jatiya-party" },
      { name_bn: "জামায়াতে ইসলামী", name_en: "Jamaat-e-Islami", short_name: "JI", slug: "jamaat-e-islami" },
      { name_bn: "স্বতন্ত্র", name_en: "Independent", short_name: "IND", slug: "independent" },
    ])
    .returningAll()
    .execute();
  console.log(`Seeded ${parties.length} parties`);

  const partyIds = parties.map((p) => p.id);

  // Constituencies — 3 per district = 24
  const conValues = districts.flatMap((d) =>
    [1, 2, 3].map((i) => {
      const voters = 200000 + Math.floor(Math.random() * 100000);
      const cast = Math.floor(voters * (0.4 + Math.random() * 0.3));
      const rejected = Math.floor(cast * 0.02);
      return {
        ec_constituency_id: d.ec_zilla_id * 10 + i,
        district_id: d.id,
        name_bn: `${d.name_bn}-${i}`,
        name_en: `${d.name_en}-${i}`,
        slug: `${d.slug}-${i}`,
        total_voters: voters,
        total_votes_cast: cast,
        total_valid_votes: cast - rejected,
        total_rejected_votes: rejected,
      };
    })
  );

  const constituencies = await db
    .insertInto("constituencies")
    .values(conValues)
    .returningAll()
    .execute();
  console.log(`Seeded ${constituencies.length} constituencies`);

  // Candidates — 5 per constituency
  const namePool = [
    "আব্দুল করিম", "মোঃ রহিম উদ্দিন", "ফাতেমা বেগম", "শাহিদুল ইসলাম", "নূর মোহাম্মদ",
    "কামাল হোসেন", "রেজাউল হক", "শিরিন আক্তার", "মাহমুদ আলী", "সালমা খাতুন",
    "জাহাঙ্গীর আলম", "মোস্তাফিজুর রহমান", "রুবিনা ইয়াসমিন", "ইকবাল হোসেন", "দিলরুবা নাসরীন",
    "হাসান মাহমুদ", "বদরুল আলম", "নাজমা আক্তার", "ফয়সাল আহমেদ", "আমিনা বেগম",
    "তারেক রহমান", "সাইদুর রহমান", "হালিমা খাতুন", "আশরাফুল আলম", "জাকিয়া সুলতানা",
  ];

  const candidateValues = constituencies.flatMap((con, ci) => {
    const valid = con.total_valid_votes ?? 100000;
    const ratios = [0.38, 0.32, 0.15, 0.10, 0.05];
    return ratios.map((r, j) => ({
      constituency_id: con.id,
      party_id: partyIds[j],
      name_bn: namePool[(ci * 5 + j) % namePool.length],
      total_votes: Math.floor(valid * r + (Math.random() - 0.5) * valid * 0.04),
      is_winner: j === 0,
    }));
  });

  const candidates = await db
    .insertInto("candidates")
    .values(candidateValues)
    .returningAll()
    .execute();
  console.log(`Seeded ${candidates.length} candidates`);

  // Centers — 5 per constituency
  const centerValues = constituencies.flatMap((con) =>
    [1, 2, 3, 4, 5].map((i) => {
      const voters = Math.floor((con.total_voters ?? 200000) / 5 + (Math.random() - 0.5) * 5000);
      const cast = Math.floor(voters * (0.4 + Math.random() * 0.3));
      return {
        ec_center_id: con.ec_constituency_id * 100 + i,
        constituency_id: con.id,
        center_number: i,
        name_bn: `কেন্দ্র ${i} - ${con.name_bn}`,
        total_voters: voters,
        total_votes_cast: cast,
      };
    })
  );

  const centers = await db
    .insertInto("centers")
    .values(centerValues)
    .returningAll()
    .execute();
  console.log(`Seeded ${centers.length} centers`);

  // Center results
  const resultValues = centers.flatMap((center) => {
    const conCandidates = candidates.filter((c) => c.constituency_id === center.constituency_id);
    const totalVotes = conCandidates.reduce((s, c) => s + (c.total_votes ?? 0), 0) || 1;
    const centerVotes = center.total_votes_cast ?? 10000;

    return conCandidates.map((c) => ({
      center_id: center.id,
      candidate_id: c.id,
      votes: Math.max(0, Math.floor(centerVotes * ((c.total_votes ?? 0) / totalVotes) + (Math.random() - 0.5) * 200)),
    }));
  });

  // Insert in batches of 500
  for (let i = 0; i < resultValues.length; i += 500) {
    await db.insertInto("center_results").values(resultValues.slice(i, i + 500)).execute();
  }
  console.log(`Seeded ${resultValues.length} center results`);

  console.log("Done!");
  await db.destroy();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
