const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

const str = "thanh@kdkd.com";

console.log(re.test(str));
