-- 更新文章表的外键约束，改为级联删除
-- 首先删除现有的外键约束
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_directory_id_fkey;

-- 添加新的外键约束，设置为级联删除
ALTER TABLE articles 
ADD CONSTRAINT articles_directory_id_fkey 
FOREIGN KEY (directory_id) 
REFERENCES directories(id) 
ON DELETE CASCADE;