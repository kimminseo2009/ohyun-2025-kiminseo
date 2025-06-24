document.getElementById('calcBtn').addEventListener('click', async function() {
  const numberInputs = Array.from(document.getElementsByClassName('number-input'));
  const operator = document.getElementById('operator').value;
  // 빈 입력값을 연산자에 따라 자동으로 채우기
  numberInputs.forEach(input => {
    if (!input.value.trim()) {
      if (operator === '*' || operator === '/') {
        input.value = 1;
      } else {
        input.value = 0;
      }
    }
  });

  const numbers = numberInputs.map(input => parseFloat(input.value));
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

    // 입력값 자체를 서버에 저장
    await fetch('http://crud.tlol.me/asdf1/cal', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          numbers: numbers,
          operator: operator,
          result: result,
          inputs: numberInputs.map(input => input.value) // 입력값 원본 저장
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

// 계산 기록 불러오기 함수
async function fetchHistory() {
  const resultDiv = document.getElementById('result');
  try {
    const response = await fetch('http://crud.tlol.me/asdf1/cal'); // 오타 수정: http:/ → http://
    const data = await response.json();
    if (!data.data || data.data.length === 0) {
      resultDiv.innerHTML = '<div class="history-empty">저장된 계산 기록이 없습니다.</div>';
      return;
    }
    console.log('불러온 기록:', data);
    // 기록이 있을 경우 HTML로 변환
    const historyHtml = data.data.map(item => {
      console.log('기록 아이템:', item.data);
      
      const nums = item.numbers ? item.numbers.join(` ${item.operator} `) : '';
      return `<div class="history-item">${nums} = <b>${item.result}</b></div>`;
    }).join('');
    resultDiv.innerHTML = `<div class="history-list">${historyHtml}</div>`;
  } catch (e) {
    resultDiv.textContent = '기록 불러오기 에러: ' + e.message;
  }
}

// 기록 보기 버튼 이벤트 리스너
const historyBtn = document.getElementById('historyBtn');
if (historyBtn) {
  historyBtn.addEventListener('click', fetchHistory);
}

// 입력값 모두 삭제 함수
function clearInputs() {
  const numberInputs = document.getElementsByClassName('number-input');
  Array.from(numberInputs).forEach(input => {
    input.value = '';
  });
}

// 입력값 삭제 버튼 이벤트 리스너
const clearBtn = document.getElementById('clearBtn');
if (clearBtn) {
  clearBtn.addEventListener('click', clearInputs);
}
