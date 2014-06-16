/**
 * A neural network consisting of a number of layers, filled
 * with a number of neurons.
 * @param {[type]} numInputs                [description]
 * @param {[type]} numOutputs               [description]
 * @param {[type]} numHiddenLayers          [description]
 * @param {[type]} numNeuronsPerHiddenLayer [description]
 */
module.exports = function (numInputs, numOutputs, numHiddenLayers, numNeuronsPerHiddenLayer) {

    var NeuralNetwork = {};

    // Initialise everything
    NeuralNetwork.numInputs                = numInputs;
    NeuralNetwork.numOutputs               = numOutputs;
    NeuralNetwork.numHiddenLayers          = numHiddenLayers;
    NeuralNetwork.numNeuronsPerHiddenLayer = numNeuronsPerHiddenLayer;

    // Initialise the layers of the network
    NeuralNetwork.layers = [];

    // If we have at least 1 hidden layer, create them, otherwise just create an
    // output layer
    if (NeuralNetwork.numHiddenLayers > 0) {

        // Create the first hidden layer with the number of inputs per
        // neuron as the number of inputs into the network
        NeuralNetwork.layers.push(new Brainwave.NeuronLayer(NeuralNetwork.numNeuronsPerHiddenLayer, NeuralNetwork.numInputs));

        // Create the other hidden layers if there are any
        for (var i = 0; i < this.numHiddenLayers - 1; i++) {
            // This time the hidden layer should have the number of neurons
            // per layer as the number of inputs, as it is behind the input layer
            NeuralNetwork.layers.push(new Brainwave.NeuronLayer(NeuralNetwork.numNeuronsPerHiddenLayer, NeuralNetwork.numNeuronsPerHiddenLayer));
        }

        // Finally create the out put layer. The number of neurons will be equal to
        // the desired number of outputs, and the number of inputs equal to the number
        // of neurons per hidden layer
        NeuralNetwork.layers.push(new Brainwave.NeuronLayer(NeuralNetwork.numOutputs, NeuralNetwork.numNeuronsPerHiddenLayer));

    } else {

        // Create an output layer
        NeuralNetwork.layers.push(NeuralNetwork.numOutputs, NeuralNetwork.numInputs);

    }

    /**
     * Returns the total number of weights in the
     * neural network
     */
    NeuralNetwork.getNumWeights = function() {
        var numWeights = 0;

        // Loop through every layer
        for (var i = 0; i < NeuralNetwork.layers.length; i++) {

            // Loop through each neuron in the layer
            for (var j = 0; j < NeuralNetwork.layers[i].neurons.length; j++) {

                // For every weight in the neuron
                for (var k = 0; k < NeuralNetwork.layers[i].neurons[j].weights.length; k++) {

                    // Count the weight
                    numWeights++;

                }

            }

        }

        return numWeights;

    };

    /**
     * Imports a flat array of weights into the network
     * @param Array weights The array of weights to import
     */
    NeuralNetwork.importWeights = function (weights) {

        // Check we have the correct number of weights
        if (weights.length != NeuralNetwork.getNumWeights()) {
            throw 'Wrong number of weights. Expected: ' + NeuralNetwork.getNumWeights();
        }

        var weightCounter = 0;

        // Loop through every layer
        for (var i = 0; i < NeuralNetwork.layers.length; i++) {

            // Loop through each neuron in the layer
            for (var j = 0; j < NeuralNetwork.layers[i].neurons.length; j++) {

                // For every weight in the neuron
                for (var k = 0; k < NeuralNetwork.layers[i].neurons[j].weights.length; k++) {

                    // Add the weight to the nuerons weights
                    NeuralNetwork.layers[i].neurons[j].weights[k] = weights[weightCounter];

                    weightCounter++;

                }

            }

        }

    };

    /**
     * Returns all of the weights in the nueral network
     * as a flat array
     */
    NeuralNetwork.exportWeights = function () {
        var weights = [];

        // Loop through every layer
        for (var i = 0; i < NeuralNetwork.layers.length; i++) {

            // Loop through each neuron in the layer
            for (var j = 0; j < NeuralNetwork.layers[i].neurons.length; j++) {

                // For every weight in the neuron
                for (var k = 0; k < NeuralNetwork.layers[i].neurons[j].weights.length; k++) {

                    // Push the weight to the weights array
                    weights.push(NeuralNetwork.layers[i].neurons[j].weights[k]);

                }

            }

        }

        return weights;
    };

    /**
     * Runs the neural network generating an output
     * from the provided input
     * @param  Array inputs     An array of input values
     * @return Array    An array of outputs
     */
    NeuralNetwork.run = function (inputs) {
        var outputs = [];

        // First check we have the correct number of inputs
        if (inputs.length != NeuralNetwork.numInputs) {
            throw 'Wrong number of inputs you crettin! Expected: ' + NeuralNetwork.numInputs + ' Found: ' + inputs.length;
        }

        // For every layer in the network
        for (var i = 0; i < NeuralNetwork.layers.length; i ++) {

            // If its not the first layer, set the inputs equal to the
            // outputs of the previous layer
            if (i > 0) {
                inputs = outputs;
            }

            // Get the outputs from the current layer
            outputs = NeuralNetwork.layers[i].getOutput(inputs);

        }

        return outputs;
    };

    return NeuralNetwork;

};
