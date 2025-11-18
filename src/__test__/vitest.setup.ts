import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { beforeEach } from "vitest";

/**
 * 각 테스트 전에 실행되는 함수
 */
beforeEach(() => {
  cleanup();
});
