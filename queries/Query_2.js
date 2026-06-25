SELECT
    name,
    slug
FROM
    "locations" ,
WHERE
    name LIKE CONCAT('%', :${请输入名称片段}, '%');