export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'smb' | 'cpa' | 'admin'
          business_name: string | null
          specialty: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'smb' | 'cpa' | 'admin'
          business_name?: string | null
          specialty?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'smb' | 'cpa' | 'admin'
          business_name?: string | null
          specialty?: string | null
          created_at?: string
        }
      }
    }
  }
}
