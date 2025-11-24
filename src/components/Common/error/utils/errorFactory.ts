import {
  AppError,
  AuthError,
  DatabaseError,
  NetworkError,
  UnexpectedError,
  DatabaseErrorCode,
  NetworkErrorCode,
  ServiceErrorCode,
  ServiceError,
  AuthErrorCode,
} from "../type/error.type";
import {
  isAuthApiError,
  PostgrestError,
  AuthError as SupabaseAuthError,
} from "@supabase/supabase-js";

export const createErrorObject = (
  error: SupabaseAuthError | PostgrestError | Error | unknown
): AppError => {
  if (isAuthApiError(error)) {
    console.log("AuthError", error);
    return new AuthError(error.message, error.code as string, error.status);
  }

  // 2. Database 에러 (PostgrestError)
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    "message" in error
  ) {
    const dbError = error as PostgrestError;
    if (
      dbError.code &&
      Object.values(DatabaseErrorCode).includes(
        dbError.code as DatabaseErrorCode
      )
    ) {
      console.log("DatabaseError", dbError);
      return new DatabaseError(dbError.message, dbError.code, 500);
    }
  }

  // 3. Network 에러
  if (error instanceof TypeError && error.message.includes("fetch")) {
    console.log("NetworkError", error);
    return new NetworkError(
      "네트워크 연결을 확인해주세요.",
      NetworkErrorCode.FETCH_ERROR,
      0
    );
  }

  console.log("UnexpectedError", error);
  return new UnexpectedError(
    "예상치 못한 오류가 발생했습니다.",
    UnexpectedError.name,
    500
  );
};

/**
 * 사용자 친화적인 에러 메시지 생성
 */
export function getUserFriendlyErrorMessage(error: AppError): string {
  // Authentication 에러 메시지
  const authMessages: Record<string, string> = {
    [AuthErrorCode.INVALID_CREDENTIALS]:
      "이메일 또는 비밀번호가 올바르지 않습니다.",
    [AuthErrorCode.EMAIL_NOT_FOUND]: "등록되지 않은 이메일입니다.",
    [AuthErrorCode.INVALID_PASSWORD]: "비밀번호가 올바르지 않습니다.",
    [AuthErrorCode.EMAIL_NOT_CONFIRMED]: "이메일 인증이 필요합니다.",
    [AuthErrorCode.USER_ALREADY_EXISTS]: "이미 가입된 이메일입니다.",
    [AuthErrorCode.WEAK_PASSWORD]:
      "비밀번호가 너무 약합니다. 최소 6자 이상 입력해주세요.",
    [AuthErrorCode.PASSWORD_MISMATCH]: "비밀번호가 일치하지 않습니다.",
    [AuthErrorCode.SESSION_EXPIRED]:
      "세션이 만료되었습니다. 다시 로그인해주세요.",
    [AuthErrorCode.OVER_REQUEST_RATE_LIMIT]:
      "너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.",
  };

  // Database 에러 메시지
  const databaseMessages: Record<string, string> = {
    [DatabaseErrorCode.UNIQUE_VIOLATION]: "이미 존재하는 데이터입니다.",
    [DatabaseErrorCode.FOREIGN_KEY_VIOLATION]:
      "관련된 데이터를 먼저 처리해주세요.",
    [DatabaseErrorCode.NOT_NULL_VIOLATION]: "필수 입력 항목이 누락되었습니다.",
    [DatabaseErrorCode.INVALID_TEXT_REPRESENTATION]:
      "잘못된 데이터 형식입니다.",
    [DatabaseErrorCode.CONNECTION_FAILURE]: "데이터베이스 연결에 실패했습니다.",
    [DatabaseErrorCode.INSUFFICIENT_PRIVILEGE]: "권한이 부족합니다.",
    [DatabaseErrorCode.RLS_POLICY_VIOLATION]: "접근 권한이 없습니다.",
  };

  // Network 에러 메시지
  const networkMessages: Record<string, string> = {
    [NetworkErrorCode.NO_INTERNET_CONNECTION]: "인터넷 연결을 확인해주세요.",
    [NetworkErrorCode.CONNECTION_TIMEOUT]: "연결 시간이 초과되었습니다.",
    [NetworkErrorCode.SERVICE_UNAVAILABLE]:
      "서비스를 일시적으로 이용할 수 없습니다.",
    [NetworkErrorCode.TOO_MANY_REQUESTS]:
      "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
  };

  // Service 에러 메시지
  const serviceMessages: Record<string, string> = {
    [ServiceErrorCode.SERVICE_UNAVAILABLE]:
      "Supabase 서비스를 이용할 수 없습니다.",
    [ServiceErrorCode.API_QUOTA_EXCEEDED]: "API 사용량이 초과되었습니다.",
    [ServiceErrorCode.INVALID_API_KEY]: "API 키가 올바르지 않습니다.",
  };

  // 에러 코드에 맞는 메시지 반환
  if (error instanceof AuthError) {
    return authMessages[error.code] || "Authentication 오류가 발생했습니다.";
  }

  if (error instanceof DatabaseError) {
    return databaseMessages[error.code] || "데이터베이스 오류가 발생했습니다.";
  }

  if (error instanceof NetworkError) {
    return networkMessages[error.code] || "네트워크 오류가 발생했습니다.";
  }

  if (error instanceof ServiceError) {
    return serviceMessages[error.code] || "서비스 오류가 발생했습니다.";
  }

  return error.message || "알 수 없는 오류가 발생했습니다.";
}
