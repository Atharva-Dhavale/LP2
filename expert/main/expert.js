function evaluateEmployee()
{
    // Input Values

    var name =
        document.getElementById("name").value;

    var department =
        document.getElementById("department").value;

    var attendance =
        parseInt(
            document.getElementById("attendance").value
        );

    var task =
        parseInt(
            document.getElementById("task").value
        );

    var communication =
        parseInt(
            document.getElementById("communication").value
        );

    var teamwork =
        parseInt(
            document.getElementById("teamwork").value
        );

    var punctuality =
        parseInt(
            document.getElementById("punctuality").value
        );



    // Validation

    if(
        name == "" ||
        isNaN(attendance) ||
        isNaN(task) ||
        isNaN(communication) ||
        isNaN(teamwork) ||
        isNaN(punctuality)
    )
    {
        alert("Please fill all fields");
        return;
    }



    // Weighted Score Calculation

    var score =

        (attendance * 0.20) +
        (task * 0.35) +
        (communication * 0.15) +
        (teamwork * 0.15) +
        (punctuality * 0.15);



    // Grade Logic

    var grade = "";
    var category = "";
    var recommendation = "";

    if(score >= 90)
    {
        grade = "A+";
        category = "Leadership Material";
        recommendation =
            "Promotion Recommended 🏆";
    }

    else if(score >= 75)
    {
        grade = "A";
        category = "High Performer";
        recommendation =
            "Eligible for Bonus ⭐";
    }

    else if(score >= 60)
    {
        grade = "B";
        category = "Average Performer";
        recommendation =
            "Needs Skill Improvement 👍";
    }

    else
    {
        grade = "C";
        category = "Low Performer";
        recommendation =
            "Training Required ⚠";
    }



    // Strength and Weakness Detection

    var strengths = [];
    var weaknesses = [];

    if(attendance >= 80)
        strengths.push("Attendance");

    else
        weaknesses.push("Attendance");


    if(task >= 80)
        strengths.push("Task Completion");

    else
        weaknesses.push("Task Completion");


    if(communication >= 80)
        strengths.push("Communication");

    else
        weaknesses.push("Communication");


    if(teamwork >= 80)
        strengths.push("Teamwork");

    else
        weaknesses.push("Teamwork");


    if(punctuality >= 80)
        strengths.push("Punctuality");

    else
        weaknesses.push("Punctuality");



    // Display Result

    document.getElementById("empName").innerHTML =
        name;

    document.getElementById("empDept").innerHTML =
        department;

    document.getElementById("score").innerHTML =
        score.toFixed(2) + "%";

    document.getElementById("grade").innerHTML =
        grade;

    document.getElementById("category").innerHTML =
        category;

    document.getElementById("strength").innerHTML =
        strengths.join(", ");

    document.getElementById("weakness").innerHTML =
        weaknesses.join(", ");

    document.getElementById("recommendation").innerHTML =
        recommendation;



    // Dynamic Result Color

    var resultBox =
        document.getElementById("result");

    if(score >= 90)
    {
        resultBox.style.borderLeft =
            "8px solid green";
    }

    else if(score >= 75)
    {
        resultBox.style.borderLeft =
            "8px solid blue";
    }

    else if(score >= 60)
    {
        resultBox.style.borderLeft =
            "8px solid orange";
    }

    else
    {
        resultBox.style.borderLeft =
            "8px solid red";
    }

    resultBox.style.display = "block";
}