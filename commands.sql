CREATE TABLE blogs (id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes integer default 0);
insert into blogs (author, text, title, likes) values ('Thushan', 'This is bob text', 'Hello Title', 5);
insert into blogs (url, title) values ('www.f&f.com', 'Fast and Furious Title');
select * from blogs;