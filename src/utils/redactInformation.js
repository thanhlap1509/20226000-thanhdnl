const redactEmail = (email) => {
  return email.replace(/^(.{0,3}).*(@.*)$/, "$1***$2");
};

export { redactEmail };
