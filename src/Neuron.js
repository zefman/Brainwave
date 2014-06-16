/**
 * Represents a single neuron in a neural network
 * Takes an input and provides an output
 * @param Integer numberOfInputs
 */
module.exports = function(numberOfInputs) {

    var Neuron = {};

    Neuron.numberOfInputs = numberOfInputs;

    // We add one to the number of inputs to hold the bias
    Neuron.numberOfWeights = numberOfInputs + 1;

    // Create and initialise the weights
    Neuron.weights = [];

    // To inititialise we fill with random values betweon -1 & 1
    for (var i = 0; i < Neuron.numberOfWeights; i++) {
        Neuron.weights.push(Brainwave.Helpers.getRandomClamped());
    }

    /**
     * Returns the output from this neuron after proving
     * an array of input values
     * @param Array inputs
     */
    Neuron.getOutput = function(inputs) {

        if (inputs.length != this.numberOfInputs) {
            throw "Wrong number of inputs. Sort it out!!!";
        }

        var netInput = 0;

        // Sum all inputs times their corresponding weights
        // numberOfWeights - 1 times so we don't look at the bias
        // that is stored as a weight too.
        for (var i = 0; i < this.numberOfWeights - 1; i++) {
            netInput += inputs[i] * this.weights[i];
        }

        // Add the neuron bias that was stored with the weights
        netInput += this.weights[this.numberOfWeights - 1] * -1;

        // Finally return the netInput through the sigmoid function
        return Brainwave.Helpers.sigmoid(netInput);

    };

    return Neuron;

};
