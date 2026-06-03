/*
  # Forge Platform Schema

  ## New Tables

  1. `projects`
     - id (uuid, primary key)
     - user_id (uuid, references auth.users, cascade delete)
     - name (text, required)
     - description (text, optional)
     - template (text, default 'blank')
     - created_at, updated_at (timestamptz)

  2. `files`
     - id (uuid, primary key)
     - project_id (uuid, references projects, cascade delete)
     - path (text, required)
     - content (text, required)
     - updated_at (timestamptz)
     - unique constraint on (project_id, path)

  3. `messages`
     - id (uuid, primary key)
     - project_id (uuid, references projects, cascade delete)
     - role (text, check: 'user' | 'assistant')
     - content (text, required)
     - created_at (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can only access their own projects (ownership via user_id)
  - Files and messages are accessible only through project ownership
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  template text DEFAULT 'blank',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  path text NOT NULL,
  content text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, path)
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  role text CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can select files via project ownership"
  ON files FOR SELECT
  TO authenticated
  USING (project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert files via project ownership"
  ON files FOR INSERT
  TO authenticated
  WITH CHECK (project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update files via project ownership"
  ON files FOR UPDATE
  TO authenticated
  USING (project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  ))
  WITH CHECK (project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete files via project ownership"
  ON files FOR DELETE
  TO authenticated
  USING (project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can select messages via project ownership"
  ON messages FOR SELECT
  TO authenticated
  USING (project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert messages via project ownership"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update messages via project ownership"
  ON messages FOR UPDATE
  TO authenticated
  USING (project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  ))
  WITH CHECK (project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete messages via project ownership"
  ON messages FOR DELETE
  TO authenticated
  USING (project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  ));
