document.getElementById('calcBtn').addEventListener('click', async function() {
  const numberInputs = Array.from(document.getElementsByClassName('number-input'));
    // 빈 입력값을 1로 채우기
  numberInputs.forEach(input => {
    if (!input.value.trim()) {
      input.value = 1;
    }
  });

  const numbers = numberInputs.map(input => parseFloat(input.value));
  const operator = document.getElementById('operator').value;
  const resultDiv = document.getElementById('result');

  try {
    let result;
    // 직접 계산 수행
    switch(operator) {
      case '+':
        result = numbers.reduce((sum, num) => sum + num, 0);
        break;
      case '-':
        result = numbers.reduce((diff, num, index) => 
          index === 0 ? num : diff - num
        );
        break;
      case '*':
        result = numbers.reduce((product, num) => product * num, 1);
        break;
      case '/':
        if(numbers.slice(1).some(num => num === 0)) {
          throw new Error('0으로 나눌 수 없습니다.');
        }
        result = numbers.reduce((quotient, num, index) => 
          index === 0 ? num : quotient / num
        );
        break;
      default:
        throw new Error('잘못된 연산자입니다.');
    }

    // 계산 결과를 API에 저장
    await fetch('http://crud.tlol.me/abc/post', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        total: 1,
        page: 0,
        pageSize: 1,
        data: [{
          numbers: numbers,
          operator: operator,
          result: result
        }]
      })
    });

    // 결과 표시
    const calculation = numbers.join(` ${operator} `);
    resultDiv.innerHTML = `<div class="result-display">
      <div class="calculation">${calculation} = </div>
      <div class="final-result">${result}</div>
    </div>`;

  } catch (e) {
    resultDiv.textContent = '에러: ' + e.message;
    console.error('계산 에러:', e);
  }
});
