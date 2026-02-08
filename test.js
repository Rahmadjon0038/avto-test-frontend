fetch("https://www.avtoquiz.uz/tickets/9")
  .then(res => res.json())
  .then(data => {
    console.log(data);
  });
