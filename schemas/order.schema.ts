import { z } from "zod";
export const orderSchema = z.object({
  quantity: z
    .number()
    .min(1, "1以上の数値を入力してください")
    .max(200, "200個を超える数値は入力できません"),
});
