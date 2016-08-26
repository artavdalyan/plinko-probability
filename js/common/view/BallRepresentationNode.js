// Copyright 2015, University of Colorado Boulder

/**
 * Scenery node that represents a ball.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );

  /**
   * @param {number} radius - in view coordinates
   * @constructor
   */
  function BallRepresentationNode( radius ) {

    Node.call( this );

    //  create and add the representation for a ball
    var ballRepresentation = new Circle( radius, {
      stroke: PlinkoConstants.BALL_COLOR,
      lineWidth: 0.1 * radius,
      fill: new RadialGradient( -radius * 0.4,  // gives ball white glare
        -radius * 0.4,
        0,
        radius * 0.1,
        -radius * 0.3,
        radius * 0.6 )
        .addColorStop( 0, PlinkoConstants.BALL_HIGHLIGHT_COLOR )
        .addColorStop( 1, PlinkoConstants.BALL_COLOR )
    } );
    this.addChild( ballRepresentation );
  }

  plinkoProbability.register( 'BallRepresentationNode', BallRepresentationNode );

  return inherit( Node, BallRepresentationNode );
} );