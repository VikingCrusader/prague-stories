SELECT
    name,
    slug
FROM
    "prague-stories"   -- 如果集合名不同，请自行修改
WHERE
    name LIKE CONCAT('%', :${请输入名称片段}, '%');