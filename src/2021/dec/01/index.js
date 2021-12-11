const input = [];
  
  const countIndividualGreater = (input) => {
  let greater = 0;
  for (let i = 1; i < input.length; i++) {
    if (input[i - 1] < input[i]) greater++;
  }
  return greater;
};

const createWindowSummer = (input, size) => (start) => {
  let sum = 0;
  for (let i = start; i < start + size; i++) {
    sum += input[i];
  }
  return sum;
};

const countWindowGreater = (input, windowSize) => {
  const summer = createWindowSummer(input, windowSize);
  let greater = 0;
  for (let i = 1; i <= input.length - windowSize; i++) {
    if (summer(i - 1) < summer(i)) greater++;
  }
  return greater;
};
