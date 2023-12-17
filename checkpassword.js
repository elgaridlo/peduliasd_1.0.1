const bycrpt = require('bcryptjs');

const correctPassword = async (candidatePassword, userPassword) => {
  return await bycrpt.compare(candidatePassword, userPassword);
};

const check = async () => {
  console.log(
    'check - ',
    await correctPassword(
      'elga1234',
      '$2a$12$L8I7j8UkAu/MJyNhfhwsRO0iR7C.C/LLJvukPciL24kJqr/Z6Kkiy',
    ),
  );
};

check();
