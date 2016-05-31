// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for Plinko Probability Intro
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
    'use strict';

    // modules
    var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
    var GaltonBoard = require( 'PLINKO_PROBABILITY/common/model/GaltonBoard' );
    var Histogram = require( 'PLINKO_PROBABILITY/common/model/Histogram' );
    var inherit = require( 'PHET_CORE/inherit' );
    var ObservableArray = require( 'AXON/ObservableArray' );
    var PropertySet = require( 'AXON/PropertySet' );
    var Sound = require( 'VIBE/Sound' );


    // audio
    var bonk1Audio = require( 'audio!PLINKO_PROBABILITY/bonk-1-for-plinko' );
    var bonk2Audio = require( 'audio!PLINKO_PROBABILITY/bonk-2-for-plinko' );

    // constants
    var SOUND_TIME_INTERVAL = 100;   // in millisecond, minimum sound time interval between two sounds.


    function PlinkoProbabilityCommonModel() {

      PropertySet.call( this, {
        probability: 0.5,
        histogramMode: 'count', // acceptable values are 'count' and 'fraction'
        ballMode: 'oneBall', // acceptable values are 'oneBall' and 'continuous'
        histogramVisible: false,
        isBallCapReached: false, // is the maximum of balls reached?
        numberOfRows: 12,
        galtonBoardRadioButton: 'ball', // Valid values are 'ball', 'path', and 'none'.
        isSoundEnabled: false,
        isPlaying: false  // false if no balls are being dropped true if they are
      } );

      //Audio for ball hitting pegs
      this.bonk1Audio = new Sound( bonk1Audio );
      this.bonk2Audio = new Sound( bonk2Audio );

      this.launchedBallsNumber = 0; // number of current trial (current ball drop)

      this.galtonBoard = new GaltonBoard( this.numberOfRowsProperty ); // create the galton board
      this.balls = new ObservableArray(); // the balls that are currently on the screen
      this.histogram = new Histogram( this.numberOfRowsProperty );
      this.landedBallsNumber = this.histogram.landedBallsNumber; //number of balls in the histogram


      // keep track of time, for playing sound purposes
      this.oldTime = new Date().getTime();

    }


    plinkoProbability.register( 'PlinkoProbabilityCommonModel', PlinkoProbabilityCommonModel );

    return inherit( PropertySet, PlinkoProbabilityCommonModel, {

      /**
       * play sound at a certain rate
       * @param {number} direction
       */
      playBallHittingPegSound: function( direction ) {
        var thisModel = this;

        if ( thisModel.isSoundEnabled ) {
          // get current time
          var currentTime = new Date().getTime();

          //play sound if the previous sound was played more than some elapsed time
          if ( currentTime - thisModel.oldTime > SOUND_TIME_INTERVAL ) {
            //Will play sound based on ball's motion, left or right
            if ( direction === -0.5 ) {
              thisModel.bonk1Audio.play();
            }
            else {
              thisModel.bonk2Audio.play();
            }
            thisModel.oldTime = new Date().getTime();
          }
        }
      },

      /**
       * time step function that is responsible for updating the position and status of tehe balls.
       * @public
       * @param {number} dt - a small time interval
       */
      step: function( dt ) {
        this.balls.forEach( function( ball ) {
          ball.step( dt * 5 );
        } );
      },
      /**
       * Reset of the model attributes.
       * @public
       */
      reset: function() {
        PropertySet.prototype.reset.call( this );
        this.balls.clear(); // get rid of all the balls on the screen
        this.histogram.reset();
        this.launchedBallsNumber = 0;
      },

      /**
       * Function that returns the theoretical average of the binomial distribution
       * @param {number} numberOfRows - an integer
       * @param {number} probability - ranges from 0 to 1
       * @returns {number}
       */
      getTheoreticalAverage: function( numberOfRows, probability ) {
        assert && assert( numberOfRows % 1 === 0, 'number of rows should be an integer' );
        return numberOfRows * probability;
      },

      /**
       * Function that calculates the theoretical standard deviation of the binomial distribution
       * @param {number} numberOfRows - an integer
       * @param {number} probability - ranges from 0 to 1
       * @returns {number}
       */
      getTheoreticalStandardDeviation: function( numberOfRows, probability ) {
        assert && assert( numberOfRows % 1 === 0, 'number of rows should be an integer' );
        return Math.sqrt( numberOfRows * probability * (1 - probability) );
      },

      /**
       * Function that calculates the theoretical standard deviation of the mean for the current value of number of balls
       * It returns a string if there is not a single particle on the board
       * @param {number} numberOfRows - an integer
       * @param {number} probability - ranges from 0 to 1
       * @returns {number||string}
       */
      getTheoreticalStandardDeviationOfMean: function( numberOfRows, probability ) {
        assert && assert( numberOfRows % 1 === 0, 'number of rows should be an integer' );

        if ( this.landedBallsNumber > 0 ) {
          return Math.sqrt( numberOfRows * probability * (1 - probability ) / this.landedBallsNumber );
        }
        else {
          return 'Not A Number';
        }
      },

      /**
       * Function that returns the binomial coefficient, equivalent to (in Latex) ${n\choose k}$
       * usually expressed as "n choose k". It is the coefficient of the x^k term in the polynomial
       * expansion of the binomial power (1 + x)^n. It is related to the Pascal triangle.
       *
       * see http://en.wikipedia.org/wiki/Binomial_coefficient
       *
       * @param {number} n - the number of rows
       * @param {number} k - the bin number
       * @returns {number}  "n choose k"= n!/( k! (n-k)!)
       */
      getBinomialCoefficient: function( n, k ) {
        // we want (n)*(n-1)*(n-2)..(n-k+1) divided by (k)*(k-1)*(k-2)...*2*1
        var coefficient = 1;
        var i;
        for ( i = n - k + 1; i <= n; i++ ) {
          coefficient *= i;
        }
        for ( i = 1; i <= k; i++ ) {
          coefficient /= i;
        }
        return coefficient;
      },

      /**
       * Function that returns the theoretical probability that a ball in in a galton box with 'n' rows (or layers)
       * ends up in the bin number 'k' given the success  probability of every event is 'p'.
       *
       * see http://en.wikipedia.org/wiki/Binomial_distribution
       *
       * @param {number} n - the number of rows, must be an integer > 0
       * @param {number} k - the bin number - an integer between 0 and n
       * @param {number} p - the success (a.k.a binary) probability, a number between 0 and 1
       * @returns {number} P(n,k,p)= ("n choose k") * p^k * p^(n-k)
       */
      getBinomialProbability: function( n, k, p ) {
        assert && assert( k <= n, 'the bin number, k, ranges from 0 to n' );
        var binomialCoefficient = this.getBinomialCoefficient( n, k );
        var statisticalWeight = Math.pow( p, k ) * Math.pow( 1 - p, n - k );
        return binomialCoefficient * statisticalWeight;
      },

      /**
       *  Function that returns the theoretical probabilities of the binomial distribution
       *  i.e. P(n,k,p) of a binomial distribution in array form
       *
       *  see http://en.wikipedia.org/wiki/Binomial_distribution
       *
       * @returns {Array.<number>}
       */
      getBinomialDistribution: function() {
        var binomialCoefficientsArray = [];
        var k;
        // let's not try to be clever and let's go forward with the brute force approach
        for ( k = 0; k < this.numberOfRowsProperty.value + 1; k++ ) {
          binomialCoefficientsArray.push( this.getBinomialProbability( this.numberOfRowsProperty.value, k, this.probability ) );
        }
        return binomialCoefficientsArray;
      },

      /**
       *  Function that returns the theoretical probabilities of the binomial distribution
       *  i.e. P(n,k,p) of a binomial distribution in array form
       *  The binomial distribution is normalized in the sense that the largest coefficient of the array will be one.
       *
       * @returns {Array.<number>}
       */
      getNormalizedBinomialDistribution: function() {
        var binomialCoefficientsArray = this.getBinomialDistribution();
        var maxCoefficient = _.max( binomialCoefficientsArray );
        var normalizedArray = binomialCoefficientsArray.map( function( num ) {
          return num / maxCoefficient;
        } ); // fraction is smaller than one
        return normalizedArray;
      }

    } );
  }
)
;


