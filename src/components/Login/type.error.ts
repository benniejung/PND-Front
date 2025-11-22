/**
 * 인증 관련 에러 코드
 */
export enum AuthErrorCode {
  /** 잘못된 인증 정보 */
  INVALID_CREDENTIALS = "invalid_credentials",
  /** 이메일을 찾을 수 없음 */
  EMAIL_NOT_FOUND = "email_not_found",
  /** 이메일 미인증 */
  EMAIL_NOT_CONFIRMED = "email_not_confirmed",
  /** 알 수 없는 에러 */
  UNKNOWN_ERROR = "unknown_error",
  /** 로그인 실패 */
  LOGIN_FAILED = "login_failed",
}

/**
 * 에러 코드에 대응하는 한국어 에러 메시지
 */
export const AuthErrorMessages: Record<AuthErrorCode, string> = {
  [AuthErrorCode.INVALID_CREDENTIALS]:
    "이메일 또는 비밀번호가 일치하지 않습니다.",
  [AuthErrorCode.EMAIL_NOT_FOUND]: "이메일이 존재하지 않습니다.",
  [AuthErrorCode.EMAIL_NOT_CONFIRMED]: "이메일 인증이 필요합니다.",
  [AuthErrorCode.UNKNOWN_ERROR]: "알 수 없는 오류가 발생했습니다.",
  [AuthErrorCode.LOGIN_FAILED]: "로그인에 실패했습니다.",
};

/**
 * 에러 코드에 해당하는 에러 메시지를 반환하는 함수
 * @param errorCode 에러 코드
 * @returns 한국어 에러 메시지
 */
export const getAuthErrorMessage = (
  errorCode: string | AuthErrorCode
): string => {
  // Supabase 에러 코드를 AuthErrorCode로 매핑
  const normalizedCode = normalizeErrorCode(errorCode);

  // 매핑된 에러 코드가 존재하면 해당 메시지 반환
  if (normalizedCode in AuthErrorMessages) {
    return AuthErrorMessages[normalizedCode as AuthErrorCode];
  }

  // 기본 에러 메시지 반환
  return AuthErrorMessages[AuthErrorCode.LOGIN_FAILED];
};

/**
 * 다양한 형식의 에러 코드를 AuthErrorCode로 정규화
 * @param errorCode 에러 코드 (대소문자 구분 없이 다양한 형식)
 * @returns 정규화된 AuthErrorCode
 */
const normalizeErrorCode = (errorCode: string): AuthErrorCode => {
  const upperCode = errorCode.toUpperCase();

  // Supabase에서 사용하는 에러 코드 패턴 매핑
  if (
    upperCode.includes("INVALID") &&
    (upperCode.includes("CREDENTIAL") || upperCode.includes("LOGIN"))
  ) {
    return AuthErrorCode.INVALID_CREDENTIALS;
  }

  if (
    upperCode.includes("EMAIL") &&
    (upperCode.includes("NOT") || upperCode.includes("FOUND"))
  ) {
    return AuthErrorCode.EMAIL_NOT_FOUND;
  }

  if (upperCode.includes("EMAIL") && upperCode.includes("CONFIRM")) {
    return AuthErrorCode.EMAIL_NOT_CONFIRMED;
  }

  // 대소문자 매칭
  switch (upperCode) {
    case "INVALID_CREDENTIALS":
    case "INVALID_LOGIN_CREDENTIALS":
      return AuthErrorCode.INVALID_CREDENTIALS;
    case "EMAIL_NOT_FOUND":
      return AuthErrorCode.EMAIL_NOT_FOUND;
    case "EMAIL_NOT_CONFIRMED":
      return AuthErrorCode.EMAIL_NOT_CONFIRMED;
    default:
      return AuthErrorCode.UNKNOWN_ERROR;
  }
};
