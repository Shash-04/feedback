export function formatSingleFeedback(row: any): string {
  return `
Student: ${row.studentName}
Company: ${row.companyName}
Technical Skills: ${row.technicalSkills}/5
Problem Solving: ${row.problemSolving}/5
Communication Skills: ${row.communicationSkills}/5
Overall Satisfaction: ${row.overallSatisfaction}/5
Task Understanding: ${row.taskUnderstanding}
Adaptability: ${row.adaptability}
Additional Comments: ${row.additionalComments}
Submitted At: ${new Date(row.createdAt).toLocaleString()}
`.trim();
}

export function getSkillDeficiencyPercentages(rows: any[], threshold = 3) {
  const total = rows.length;
  const skills = {
    "Technical Skills": rows.map(r => Number(r.technicalSkills)),
    "Problem Solving": rows.map(r => Number(r.problemSolving)),
    "Communication Skills": rows.map(r => Number(r.communicationSkills)),
  };

  const result = Object.entries(skills).map(([skill, values]) => {
    const low = values.filter(v => v < threshold).length;
    return {
      name: skill,
      percentage: parseFloat(((low / total) * 100).toFixed(2)),
    };
  });

  return result;
}
