import { db } from "../db";

export async function getDistricts() {
  return db
    .selectFrom("districts")
    .selectAll()
    .orderBy("name_en")
    .execute();
}
