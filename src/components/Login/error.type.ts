export class AppError extends Error {
  public name: string;
  public status?: number;
  public code: string;
  constructor(name: string, message: string, code: string, status?: number) {
    super(message);
    this.name = name;
    this.status = status ?? undefined;
    this.code = code;
  }
}

/**
 * Supabase Authentication 관련 에러
 */
export class AuthError extends AppError {
  constructor(message: string, code: string, status?: number) {
    super("AuthError", message, code, status);
  }
}

/**
 * Supabase Database 관련 에러
 */
export class DatabaseError extends AppError {
  constructor(message: string, code: string, status?: number) {
    super("DatabaseError", message, code, status);
  }
}

/**
 * 네크워크 관련 에러
 */
export class NetworkError extends AppError {
  constructor(message: string, code: string, status?: number) {
    super("NetworkError", message, code, status);
  }
}

/**
 * Service 관련 에러
 */
export class ServiceError extends AppError {
  constructor(message: string, code: string, status?: number) {
    super("ServiceError", message, code, status ?? undefined);
  }
}

/**
 * Unexpected Error 에러
 */
export class UnexpectedError extends AppError {
  constructor(message: string, code: string, status?: number) {
    super("UnexpectedError", message, code, status);
  }
}

// Authentication 오류 코드
export enum AuthErrorCode {
  // 로그인 관련
  INVALID_CREDENTIALS = "invalid_credentials",
  EMAIL_NOT_FOUND = "email_not_found",
  INVALID_PASSWORD = "invalid_password",
  USER_NOT_FOUND = "user_not_found",

  // 이메일 인증
  EMAIL_NOT_CONFIRMED = "email_not_confirmed",
  EMAIL_ALREADY_CONFIRMED = "email_already_confirmed",

  // 회원가입 관련
  USER_ALREADY_EXISTS = "user_already_exists",
  WEAK_PASSWORD = "weak_password",
  PASSWORD_MISMATCH = "password_mismatch",
  PASSWORD_TOO_SHORT = "password_too_short",
  INVALID_EMAIL_FORMAT = "invalid_email_format",

  // OAuth 관련
  OAUTH_ERROR = "oauth_error",
  PROVIDER_TOKEN_MISSING = "provider_token_missing",
  GITHUB_USER_CANNOT_LOGIN_WITH_EMAIL = "github_user_cannot_login_with_email",

  // 세션 관련
  SESSION_NOT_FOUND = "session_not_found",
  SESSION_EXPIRED = "session_expired",
  REFRESH_TOKEN_NOT_FOUND = "refresh_token_not_found",
  INVALID_REFRESH_TOKEN = "invalid_refresh_token",

  // 권한 관련
  INVALID_GRANT = "invalid_grant",
  UNAUTHORIZED = "unauthorized",
  FORBIDDEN = "forbidden",

  // Rate Limiting
  OVER_REQUEST_RATE_LIMIT = "over_request_rate_limit",
  OVER_EMAIL_SEND_RATE_LIMIT = "over_email_send_rate_limit",

  // 기타
  SIGNUP_DISABLED = "signup_disabled",
  AUTH_ERROR = "auth_error",
}

// Database 오류 코드
export enum DatabaseErrorCode {
  // PostgreSQL 표준 에러 코드들

  // 연결 오류
  CONNECTION_FAILURE = "08000",
  CONNECTION_EXCEPTION = "08006",
  CONNECTION_DOES_NOT_EXIST = "08003",

  // 데이터 오류
  INVALID_TEXT_REPRESENTATION = "22P02", // 타입 변환 실패 (예: bigint to uuid)
  STRING_DATA_RIGHT_TRUNCATION = "22001",
  NUMERIC_VALUE_OUT_OF_RANGE = "22003",
  INVALID_DATETIME_FORMAT = "22007",
  DATETIME_FIELD_OVERFLOW = "22008",
  DIVISION_BY_ZERO = "22012",

  // 제약 조건 위반
  UNIQUE_VIOLATION = "23505", // UNIQUE 제약 위반 (중복 데이터)
  FOREIGN_KEY_VIOLATION = "23503", // FK 제약 위반
  NOT_NULL_VIOLATION = "23502", // NOT NULL 제약 위반
  CHECK_VIOLATION = "23514", // CHECK 제약 위반
  EXCLUSION_VIOLATION = "23P01",

  // 쿼리 오류
  SYNTAX_ERROR = "42601", // SQL 문법 오류
  UNDEFINED_TABLE = "42P01", // 테이블 없음
  UNDEFINED_COLUMN = "42703", // 컬럼 없음
  UNDEFINED_FUNCTION = "42883", // 함수 없음
  DUPLICATE_TABLE = "42P07", // 테이블 중복
  DUPLICATE_COLUMN = "42701", // 컬럼 중복
  AMBIGUOUS_COLUMN = "42702", // 모호한 컬럼

  // 권한 오류
  INSUFFICIENT_PRIVILEGE = "42501", // 권한 부족

  // 트랜잭션 오류
  SERIALIZATION_FAILURE = "40001", // 동시성 충돌
  DEADLOCK_DETECTED = "40P01", // 데드락

  // PostgREST 특정 오류
  PGRST_NO_ROWS = "PGRST116", // 조회 결과 없음 (maybeSingle)
  PGRST_MULTIPLE_ROWS = "PGRST116", // 여러 행 반환 (single)

  // Row Level Security
  RLS_POLICY_VIOLATION = "PGRST301", // RLS 정책 위반

  // 일반 DB 오류
  QUERY_ERROR = "DB_QUERY_ERROR",
  INSERT_ERROR = "DB_INSERT_ERROR",
  UPDATE_ERROR = "DB_UPDATE_ERROR",
  DELETE_ERROR = "DB_DELETE_ERROR",
  TRANSACTION_ERROR = "DB_TRANSACTION_ERROR",
}

// Network 오류 코드
export enum NetworkErrorCode {
  // 연결 오류
  NO_INTERNET_CONNECTION = "no_internet_connection",
  CONNECTION_TIMEOUT = "connection_timeout",
  CONNECTION_REFUSED = "connection_refused",
  CONNECTION_RESET = "connection_reset",

  // HTTP 오류
  BAD_REQUEST = "400",
  UNAUTHORIZED_HTTP = "401",
  FORBIDDEN_HTTP = "403",
  NOT_FOUND = "404",
  METHOD_NOT_ALLOWED = "405",
  REQUEST_TIMEOUT = "408",
  CONFLICT = "409",
  TOO_MANY_REQUESTS = "429",

  // 서버 오류
  INTERNAL_SERVER_ERROR = "500",
  BAD_GATEWAY = "502",
  SERVICE_UNAVAILABLE = "503",
  GATEWAY_TIMEOUT = "504",

  // 네트워크 일반
  NETWORK_ERROR = "network_error",
  DNS_ERROR = "dns_error",
  SSL_ERROR = "ssl_error",

  // Fetch API 오류
  FETCH_ERROR = "fetch_error",
  ABORT_ERROR = "abort_error",
}

// Service 오류 코드
export enum ServiceErrorCode {
  // Supabase Functions
  FUNCTION_NOT_FOUND = "function_not_found",
  FUNCTION_EXECUTION_ERROR = "function_execution_error",
  FUNCTION_TIMEOUT = "function_timeout",
  FUNCTION_RELAY_ERROR = "function_relay_error",

  // Supabase Storage
  STORAGE_NOT_FOUND = "storage_not_found",
  STORAGE_UPLOAD_ERROR = "storage_upload_error",
  STORAGE_DOWNLOAD_ERROR = "storage_download_error",

  // Supabase Realtime
  REALTIME_CONNECTION_ERROR = "realtime_connection_error",
  REALTIME_SUBSCRIPTION_ERROR = "realtime_subscription_error",

  // API 제한
  API_QUOTA_EXCEEDED = "api_quota_exceeded",
  API_RATE_LIMIT_EXCEEDED = "api_rate_limit_exceeded",

  // 서비스 상태
  SERVICE_UNAVAILABLE = "service_unavailable",
  SERVICE_MAINTENANCE = "service_maintenance",
  SERVICE_DEGRADED = "service_degraded",

  // 설정 오류
  INVALID_API_KEY = "invalid_api_key",
  INVALID_PROJECT_URL = "invalid_project_url",
  MISSING_CONFIGURATION = "missing_configuration",
}
