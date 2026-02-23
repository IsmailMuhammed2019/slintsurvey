const answers = {};
for (let i = 1; i <= 200; i++) {
    answers[`Q${i}`] = "This is a reasonably long answer to a survey question to increase the payload size. ".repeat(5);
}
// Add required fields
answers.A1 = "Large Load Test";
answers.A2 = "large@example.com";
answers.B1 = ["Student"];

console.log(JSON.stringify({ answers }));
