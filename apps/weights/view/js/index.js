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

        const [muscle, exercises_weight_data] = Object.entries(muscle_exercises)[0];
        console.log(muscle); // String
        //console.log(exercises_weight_data); // Array of Objects

        for (exercise_weight_data of exercises_weight_data) {
            //console.log(exercises_weight_data); // Objects

            const [exercise, weight_data] = Object.entries(exercise_weight_data)[0];
            console.log(exercise); // String
            //console.log(weight_data); // Object

            console.log("Robert " + weight_data["Robert"]);
            console.log("Lauren " + weight_data["Lauren"]);
            console.log("Increment " + weight_data["Increment"]);
        }

        //for (muscle in muscle_weights) {
        //    console.log(muscle);
        //    for (exercise in muscle_weights[muscle]) {
        //        console.log(exercise);
        //    }
        //}
    }
//    for (const muscle_weights in weights.entries()) {
//        for (const [muscle, exercises] of muscle_weights) {
//            $("#muscle_links").append(`<a href="#${muscle}" style="font-size: 50px">${muscle}</a>`);
//        }
//    }
}
