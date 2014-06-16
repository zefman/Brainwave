Brainwave
=========

A JavaScript neural network learning using genetic algorithms. To be more specific, a Javascript implementation of the Neural network described here on the AI Junkie site: http://www.ai-junkie.com/ann/evolved/nnt1.html

You can find examples of it working here: http://jozefmaxted.co.uk/neural/index.html

Using Brainwave
===============

To begin simply include Brainwave.js on your page

```html
<script src="build/Brainwave.js"></script>
```

Brainwave has two main components, Network which of course is the neural net, and Genetics which is the genetic algorithm used to improve a population of networks.

##Creating a Neural Network

A network of varying size and structure can be created easily with the Network object. When a new network is first created its weights and biases are all initialised randomly.

```javascript
var network = new Brainwave.Network(numInputs, numOutputs, numHiddenLayers, numNeuronsPerHiddenLayer);
```

###Running the network
The network expects an array of floats to be passed as inputs. After being passed through the network, an array of output values will then be returned.

```javascript
var network = new Brainwave.Network(4, 2, 1, 4);

network.run([3.56, 2.1, 18.9, -4.7]);

// Possible output
// [ 0.656, 0.983 ]
```

## Evolving A Population of Networks

I plan to add a training helper object to make the process of setting up a bunch of networks and training them super simple once I get time, but currently networks can still be trained without too much trouble.

```javascript
var popSize = 20;

// Create an array to hold the population of networks
var networks = [];

// Populate the networks array
for (var i = 0; i < popSize; i++) {
    networks.push(new Brainwave.Network(4, 1, 1, 4));
}

// Next we need to create the Genetics object that will evolve the networks for us
var genetics = new Brainwave.Genetics(popSize, networks[0].getNumWeights());

// When creating the genetics object it will also generate random weights an baises for the networks
// These should be imported into the population of networks before beginning any training
for (var j = 0; j < popSize; j++) {
    networks[j].importWeights(genetics.population[j].weights);
}

// Now the networks and genetics are all set up training can begin. Pass each network an input and issue
// it a fitness depending on how close its output was to the desired output
for (var k = 0; k < popSize; k++) {
    var output = networks[k].run([1, 4, 6, 2]);

    // Lets just suppose we are looking for an output as close to one as possible
    var fitness = 1 - Math.abs(1 - output); // So the max fitness we can have here is 1

    // Now we need to update the genetics with this fitness
    genetics.population[k].fitness = fitness;
}

// After you have decided on a fitness for each network, we can use the genetics
// object to evolve them based on the results
genetics.epoch(genetics.population);

// Then we just need to import the new weights into the networks and repeat again and again
for (var n = 0; n < popSize; n++) {
    networks[n].importWeights(genetics.population[n].weights);
}

```
