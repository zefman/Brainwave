/**
 * Holds one layer of neurons in the nueral network
 * @param Integer numNeurons          The number of neurons in this layer
 * @param Integer numInputsPerNeuron  The number of inputs each neuron has
 */
module.exports = function (numNeurons, numInputsPerNeuron) {

    var NeuronLayer = {};

    NeuronLayer.numNeurons         = numNeurons;
    NeuronLayer.numInputsPerNeuron = numInputsPerNeuron;
    NeuronLayer.neurons            = [];

    // Initialise the neurons
    for (var i = 0; i < NeuronLayer.numNeurons; i++) {
        NeuronLayer.neurons.push(new Brainwave.Neuron(NeuronLayer.numInputsPerNeuron));
    }

    /**
     * Returns the output from each of the neurons
     * in this layer given an array of inputs
     * @param Array input
     */
    NeuronLayer.getOutput = function(input) {

        // Check the input is the right length
        if (input.length != NeuronLayer.numInputsPerNeuron) {
            throw 'Wrong number of inputs. Sort it out!!';
        }

        // Create an array to hold the output
        var output = [];

        // Get the output of each neuron in this layer
        for (var i = 0; i < NeuronLayer.neurons.length; i++) {
            output.push(NeuronLayer.neurons[i].getOutput(input));
        }

        return output;

    };

    return NeuronLayer;
};
