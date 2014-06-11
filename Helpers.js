module.exports = {

    /**
     * Returns a random number between min (inclusive) and
     * max (exclusive)
     */
    getRandomArbitrary: function(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Returns a random number between -1 and 1 inclusive
     */
    getRandomClamped: function() {
        return this.getRandomArbitrary(-1, 1);
    },

    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     */
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * This is the sigmoid function used by the neruons
     * to run their output through
     * @param  Integer x The input
     * @return Integer
     */
    sigmoid: function(input) {

        return ( 1 / ( 1 + Math.exp(-input / 1)));
    //    return 1/(1+Math.pow(Math.E, -input));

    }

};
