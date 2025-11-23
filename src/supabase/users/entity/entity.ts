/**
 * AuthProvider Enum
 */
export enum AuthProvider {
  EMAIL = "email",
  GITHUB = "github",
}

/**
 * User Entity
 * DB의 users 테이블과 1:1 매핑
 */
export class UserEntity {
  // Primary Key
  id: string;
  name: string;
  email: string;
  password: string;
  // GitHub OAuth 전용 필드
  githubId: number | null;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;

  // 가입 방법
  authProvider: AuthProvider;

  // 타임스탬프
  createdAt: Date;
  updatedAt: Date;

  constructor(data: UserEntityData) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.githubId = data.github_id ?? null;
    this.username = data.username ?? null;
    this.avatarUrl = data.avatar_url ?? null;
    this.bio = data.bio ?? null;
    this.authProvider = data.auth_provider as AuthProvider;
    this.createdAt = new Date(data.created_at);
    this.updatedAt = new Date(data.updated_at);
  }
}

/**
 * DB에서 가져온 원본 데이터 타입 (snake_case)
 */
export interface UserDatabaseRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  github_id: number | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  auth_provider: string;
  created_at: string;
  updated_at: string;
}

/**
 * Entity 생성용 데이터 타입
 */
export type UserEntityData = UserDatabaseRecord;
