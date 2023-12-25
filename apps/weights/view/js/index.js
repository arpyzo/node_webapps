var saveTimeout;
var weightIncrements = {};

$(document).ready(function() {
    ajaxGET("api/load", [populateWeights, addButtonHandler]);
});

function addMuscleLink(muscle) {
    $("#muscle-links").append(`<a href="#${muscle.toLowerCase()}" style="font-size: 50px">${muscle.toUpperCase()}</a><br>`);
}

function addMuscleSectionDivider(muscle) {
    $("body").append(`
        <a name="${muscle.toLowerCase()}"></a>
        <div class="muscle-section-divider">
            <span class="muscle-section-name">${muscle}</span>
        </div>
    `);
}

function addExercise(exercise, increment, robert_weight, lauren_weight) {
    $("body").append(`
        <div class="exercise">${exercise}</div>
        <div class="weight-pair">
            <div class="weight-widget">
                <img id="robert-${toIdFormat(exercise)}-minus" src="img/minus.jpg">
                <div id="robert-${toIdFormat(exercise)}" class="weight">${robert_weight}</div>
                <img id="robert-${toIdFormat(exercise)}-plus" src="img/plus.jpg">
            </div>

            <div class="weight-widget">
                <img id="lauren-${toIdFormat(exercise)}-minus" src="img/minus.jpg">
                <div id="lauren-${toIdFormat(exercise)}" class="weight">${lauren_weight}</div>
                <img id="lauren-${toIdFormat(exercise)}-plus" src="img/plus.jpg">
            </div>
        </div>
    `);
    
    weightIncrements[toIdFormat(exercise)] = parseFloat(increment);
}

function toIdFormat(exercise) {
    return(exercise.replaceAll(/ /g, '-').toLowerCase());
}

function populateWeights(weights) {
    for (line of weights.split("\n").slice(0, -1)) {
        line_tokens = line.split(', ');
        if (line_tokens.length == 1) {
            addMuscleLink(line_tokens[0]);
            addMuscleSectionDivider(line_tokens[0]);
        } else {
            addExercise(...line_tokens);
        }
    }
}

function addButtonHandler() {
    $("img").click(function() {
        buttonId = $(this).attr('id');
        idDividerTokens = buttonId.split('-');
        [person, exercise, incrementDirection] = [idDividerTokens[0], idDividerTokens.slice(1, -1).join('-'), idDividerTokens.at(-1)]

        weightId = person + '-' + exercise;
        increment = weightIncrements[exercise]
        weight = parseFloat($("#" + weightId).text());

        newWeight = incrementDirection == "plus" ? weight + increment : weight - increment;
        $("#" + weightId).text(newWeight);

        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveWeights, 5000);
    });
}

function saveWeights() {
    ajaxPUT("api/save", {
        weights: gatherWeights()
    });
}

function gatherWeights() {
    weights = "";

    $("div").each(function() {
        if ($(this).attr("class") == "muscle-section-divider") {
            weights += $(this).find("span").text() + "\n";
        }
        if ($(this).attr("class") == "exercise") {
            weights += $(this).text() + ", ";
            weights += weightIncrements[toIdFormat($(this).text())] + ", "; 
        }
        if ($(this).attr("class") == "weight") {
            weights += $(this).text();
            weights += $(this).attr("id").startsWith("robert") ? ", " : "\n";
        }
    });

    return weights;
}
