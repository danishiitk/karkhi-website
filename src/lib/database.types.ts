export type UserRole = "super_admin" | "village_admin" | "viewer";


export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  assigned_village_id: string | null;
  created_at: string;
};

export type Village = {
  id: string;
  slug: string;
  name: string;
  urdu_name: string;
  hindi_name?: string | null;
  alternate_spellings: string[];

  created_at: string;
};

export type Person = {
  id: string;
  name: string;
  urdu_name: string | null;
  hindi_name?: string | null;
  father_id: string | null;
  village_id: string;
  generation: number | null;
  is_placeholder: boolean;

  added_by: string | null;
  created_at: string;
  updated_at: string;
};

export type PersonInsert = {
  id: string;
  name: string;
  urdu_name?: string | null;
  hindi_name?: string | null;
  father_id?: string | null;
  village_id: string;
  generation?: number | null;
  is_placeholder?: boolean;

};

export type LineageRow = {
  id: string;
  name: string;
  urdu_name: string | null;
  father_id: string | null;
  village_id: string;
  generation: number | null;
  depth: number;
};

export type DisplayTreeNode = Person & {
  children: DisplayTreeNode[];
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          role?: UserRole;
          assigned_village_id?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          role?: UserRole;
          assigned_village_id?: string | null;
        };
        Relationships: [];
      };
      villages: {
        Row: Village;
        Insert: {
          id: string;
          slug: string;
          name: string;
          urdu_name: string;
          hindi_name?: string | null;
          alternate_spellings?: string[];
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          urdu_name?: string;
          hindi_name?: string | null;
          alternate_spellings?: string[];
        };
        Relationships: [];
      };
      people: {
        Row: Person;
        Insert: {
          id: string;
          name: string;
          urdu_name?: string | null;
          hindi_name?: string | null;
          father_id?: string | null;
          village_id: string;
          generation?: number | null;
          is_placeholder?: boolean;
          added_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          urdu_name?: string | null;
          hindi_name?: string | null;
          father_id?: string | null;
          village_id?: string;
          generation?: number | null;
          is_placeholder?: boolean;
          added_by?: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      get_lineage: {
        Args: { person_id: string };
        Returns: LineageRow[];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      confidence_level: "high" | "medium" | "low";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
