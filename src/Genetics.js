/**
 * A Genetic Algorithm class that will improve a set of chromosones
 * @param Integer popSize      The number of chromosones in the population
 * @param Integer genomeLength The number of weights in each genome
 * @param Object options      The Algorithm options
 */
module.exports = function (popSize, genomeLength, options) {

    var Genetics = {};

    /**
     * The size of the population (how many chromosome)
     * @type Integer
     */
    Genetics.popSize      = popSize;

    /**
     * The number of weights in each genome
     * @type Integer
     */
    Genetics.genomeLength = genomeLength;

    /**
     * The algorithm options and defaults
     * @type Object
     */
    Genetics.options      = $.extend({
        // Probability genomes will exchange some weights
        crossoverRate  : 0.7,
        // The chance that some weights will mutate - 0.05 to 0.3 is good
        mutationRate   : 0.05,
        // The maximum amount a weight can mutate by
        maxPertubation : 0.3,
        // The top n best performing genomes to be copied directly
        // into the next generation. numElite * numEliteCopies MUST BE EVEN
        numElite       : 4,
        // The number of copies of each elite to be placed into the
        // next population
        numEliteCopies : 1
    }, options);

    // Check that popSize is even
    if ((Genetics.popSize % 2) != 0) {
        throw 'popSize must be even';
    }

    // Check that numElite * numEliteCopies is even to prevent the roulette wheel
    // sampling from crashing
    if (((Genetics.options.numElite * Genetics.options.numEliteCopies) % 2) != 0) {
        throw 'numElite * numEliteCopies MUST BE EVEN';
    }

    // Statistic variables
    Genetics.totalFitness   = 0;
    Genetics.bestFitness    = -999999999;
    Genetics.averageFitness = 0;
    Genetics.worstFitness   = 9999999999;
    Genetics.fittestGenome  = 0;
    Genetics.generation     = 0;

    // Initialise the population
    Genetics.population = [];
    for (var i = 0; i < Genetics.popSize; i++) {

        // Create a random set of weights
        var weights = [];
        for (var j = 0; j < Genetics.genomeLength; j++) {
            weights.push(Brainwave.Helpers.getRandomClamped());
        }

        // Create a new genome and add it to the population with
        // the initialised weights
        Genetics.population.push(new Brainwave.Genome(weights, 0));

    }

    /**
     * Given two parent genomes, this function swaps their chromosones
     * according the the crossoverRate to produce two offspring
     * @param  Genome mum Parent Genome
     * @param  Genome dad Parent Genome
     * @return Array     An array containing the offspring
     */
    Genetics.crossover = function (mum, dad) {

        // Just return the parents dependent on the crossover rate, or
        // if both the mother and father are the same
        if (Math.random() > Genetics.options.crossoverRate || mum == dad) {
            return [mum, dad];
        }

        // Find a crossover point (single point crossover)
        var cp = Brainwave.Helpers.getRandomInt(0, Genetics.genomeLength - 1);

        // Create holders for each of the babies weights
        var baby1Weights = [];
        var baby2Weights = [];

        // Fill the babies' weights with values from their mum and dad
        for (var i = 0; i < cp; i++) {
            baby1Weights.push(mum.weights[i]);
            baby2Weights.push(dad.weights[i]);
        }

        // Now the second half from the opposite parent
        for (var j = cp; j < Genetics.genomeLength; j++) {
            baby1Weights.push(dad.weights[j]);
            baby2Weights.push(mum.weights[j]);
        }

        // Create the offspring with the new weights
        var baby1 = new Brainwave.Genome(baby1Weights, 0);
        var baby2 = new Brainwave.Genome(baby2Weights, 0);

        // Return both the children in an array
        return [baby1, baby2];
    };

    /**
     * Takes a genome and mutates it weights by an amount no more
     * than this.options.maxPertubation
     * @param  Genome genome The genome to mutate
     * @return Genome     The mutated genome
     */
    Genetics.mutate = function (genome) {

        // For every weight in the genome
        for (var i = 0; i < genome.weights.length; i++) {

            // Do we mutate it?
            if (Math.random() < Genetics.options.mutationRate) {

                // Add or subtract a small amount to the weight
                genome.weights[i] += Brainwave.Helpers.getRandomClamped() * Genetics.options.maxPertubation;

            }

        }

        return genome;
    };

    /**
     * Returns one genome using roulette wheel sampling
     */
    Genetics.getGenomeRoulette = function () {

        // Generate a random number between 0 and total fitness. // Relies on
        // calcStats being called prior to this method
        var slice = Math.random() * Genetics.totalFitness;

        // Go through the genomes adding up their fitnesses
        var fitnessSoFar = 0;

        var counter = 0;
        var picked  = false;

        // Create a placeholder for the picked genome
        var theChosenOne = null;

        while (counter < Genetics.popSize && picked === false) {
            fitnessSoFar += Genetics.population[counter].fitness;

            if (fitnessSoFar >= slice) {
                // Copy the current genome, we build a new genome to avoid
                // referencing issues. Slice copies the weights array, without
                // referencing the original
                var weights  = Genetics.population[counter].weights.slice();
                theChosenOne = new Brainwave.Genome(weights, 0);
                picked       = true;
            }
            counter++;
        }

        return theChosenOne;
    };

    /**
     * Takes a population of genomes and runs through one cycle evloving
     * and (hopefully) improving them
     * @param  Array oldPopulation The old genomes
     * @return Array    An array of new modified genomes
     */
    Genetics.epoch = function (oldPopulation) {

        Genetics.population = oldPopulation;

        // Reset the stats
        Genetics.reset();

        // Calculate the stats
        Genetics.calcStats();

        // Sort the population for elitism
        Genetics.sortGenomes(Genetics.population);

        // Create an array to hold the new population
        var newPop = [];

        // First add the elites, make sure we add an even number otherwise
        // the roulette wheel sampling will fail big time
        if ((Genetics.options.numElite * Genetics.options.numEliteCopies) % 2 === 0) {
            // Get the elites and append them to the new population array
            newPop.push.apply(newPop, Genetics.grabNBest(Genetics.options.numElite, Genetics.options.numEliteCopies));
        }

        // Now we start the GA loop. Hell yeah.
        while (newPop.length < Genetics.popSize) {

            // Grab two genomes
            var mum = Genetics.getGenomeRoulette();
            var dad = Genetics.getGenomeRoulette();

            // Create some babies using crossover
            var babies = Genetics.crossover(mum, dad);

            // Mutate the babies. I have never said that before!!!
            babies[0] = Genetics.mutate(babies[0]);
            babies[1] = Genetics.mutate(babies[1]);

            // Now add the mutated babies to the new population
            newPop.push(babies[0]);
            newPop.push(babies[1]);

        }

        // Now we have a nice new population to assign it back
        Genetics.population = newPop;

        Genetics.generation++;

        return newPop;

    };

    /**
     * Sorts a population of genomes by their fitness
     * @param Array population The population of genomes to sort
     */
    Genetics.sortGenomes = function (population) {
        // Just performs a simple bubble sort on the population
        var swapped = true;
        do {
            swapped = false;
            for (var i = 0; i < population.length - 1; i++) {
                if (population[i].fitness > population[i+1].fitness) {
                    var temp        = population[i];
                    population[i]   = population[i+1];
                    population[i+1] = temp;
                    swapped         = true;
                }
            }
        } while (swapped === true);

        return population;
    };

    /**
     * Grabs the top n best of the population, and creates a specified
     * number of copies of them. Introduces elitism into the algorithm
     * @param Integer numBest   The top number of genomes to copy
     * @param Integer numCopies The number of copies of each genome
     */
    Genetics.grabNBest = function (numBest, numCopies) {

        // Make sure the population is sorted
        Genetics.population = Genetics.sortGenomes(Genetics.population);

        var elites = [];

        while (numBest > 0) {
            // Create the copies of each eilites
            for (var i = 0; i < numCopies; i++) {
                elites.push(new Brainwave.Genome(Genetics.population[Genetics.popSize - numBest].weights, 0));
            }
            numBest--;
        }

        return elites;

    };

    /**
     * Simply recalculates values to fill the statistic variables, bestFitness
     * worstFitness, fittestGenome, totalFitness, averageFitness
     */
    Genetics.calcStats = function () {

        Genetics.totalFitness = 0;

        // Need to be careful here as this can mess up
        // if we end up using negative fitnesses. Maybe change?
        var highestSoFar = 0;
        var lowestSoFar  = 9999999;

        // Look through all the genomes updating the stats,
        // this pressumes that genomes have already had their fitness
        // updated somewhere else
        for (var i = 0; i < Genetics.popSize; i++) {

            // Update the fittest
            if (Genetics.population[i].fitness > highestSoFar) {
                highestSoFar           = Genetics.population[i].fitness;
                Genetics.fittestGenome = i;
                Genetics.bestFitness   = highestSoFar;
            }

            // Update the worst
            if (Genetics.population[i].fitness < lowestSoFar) {
                lowestSoFar           = Genetics.population[i].fitness;
                Genetics.worstFitness = lowestSoFar;
            }

            // Update the total fitness
            Genetics.totalFitness += Genetics.population[i].fitness;

        }

        // Update the average fitness
        Genetics.averageFitness = Genetics.totalFitness / Genetics.popSize;

    };

    /**
     * Simply resets the stat variabeles
     */
    Genetics.reset = function () {
        Genetics.totalFitness   = 0;
        Genetics.bestFitness    = 0;
        Genetics.worstFitness   = 0;
        Genetics.averageFitness = 0;
    };

    return Genetics;

};
