import { describe, it, expect } from "vitest";

function sum(a: number, b: number): number {
    return a + b
}

describe("sum", () => {
    it("合計を計算する", () => {
        expect(sum(1, 2)).toBe(3)
    })
})