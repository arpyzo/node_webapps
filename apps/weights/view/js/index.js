$(document).ready(function() {
    ajaxGET("api/load", populateWeights);

    $("img").click(function() {
        if ($(this).hasClass("robert")) { console.log("ROBERT"); }
        if ($(this).hasClass("minus")) { console.log("MINUS"); }
    });
});

function populateWeights(weight_program) {
    for (muscle_exercises of weight_program) { // Array of Objects
        //console.log(muscle_exercises); // Object

        const muscle = Object.keys(muscle_exercises)[0];
        $("#muscle-links").append(`<a href="#${muscle.toLowerCase()}" style="font-size: 50px">${muscle.toUpperCase()}</a><br>`);
    }

    for (muscle_exercises of weight_program) { // Array of Objects
        //console.log(muscle_exercises); // Object

        const [muscle, exercises_weight_data] = Object.entries(muscle_exercises)[0];
        //console.log(muscle); // String
        $("body").append(`
            <div class="muscle-section">
                <span class="muscle-section-name">${muscle}</span>
            </div>
        `);

        for (exercise_weight_data of exercises_weight_data) {
            //console.log(exercises_weight_data); // Objects

            const [exercise, weight_data] = Object.entries(exercise_weight_data)[0];
            console.log(exercise); // String
            $("body").append(`<div class="exercise">${exercise}</div>`);

            //console.log(weight_data); // Object

            console.log("Robert " + weight_data["Robert"]);
            console.log("Lauren " + weight_data["Lauren"]);
            console.log("Increment " + weight_data["Increment"]);
        }

//    <div class="exercise">Bench Press</div>
//    <div class="weight-pair">
//        <div class="weight-widget">
//            <img id="bench_press" class="robert minus" src="img/minus.jpg">
//            <div id="r_weight" class="weight">110</div>
//            <img id="r_plus_img" src="img/plus.jpg">
//        </div>
//
//        <div class="weight-widget">
//            <img id="l_img" src="img/minus.jpg">
//            <div id="l_weight" class="weight">110</div>
//            <img id="l_plus_img" src="img/plus.jpg">
//        </div>
//    </div>
    }
}
