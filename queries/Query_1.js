SELECT
    name,
    slug
FROM
    "prague-stories"
WHERE
    name LIKE CONCAT('%', :${请输入名称片段}, '%');