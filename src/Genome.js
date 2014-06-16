/**
 * Simple class representing a single genome
 * @param Array weights An array of real numbers
 * @param Float fitness The fitness of the Genome
 */
module.exports = function (weights, fitness) {

    var Genome = {};

    Genome.fitness = fitness;
    Genome.weights = weights;

    return Genome;
};
