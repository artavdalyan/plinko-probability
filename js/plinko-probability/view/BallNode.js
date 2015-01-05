// Copyright 2002-2015, University of Colorado Boulder

/**
 * View for the falling ball.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules

  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
//  var Path = require( 'SCENERY/nodes/Path' );
  var PlinkoConstants = require( 'PLINKO/common/PlinkoConstants' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  // var Shape = require( 'KITE/Shape' );

  /**
   * Constructor for the which renders the charge as a scenery node.
   * @param {Ball} ball - model of the ball
   * @param {ModelViewTransform2} modelViewTransform - the coordinate transform between model coordinates and view coordinates
   * @constructor
   */
  function BallNode( ball, modelViewTransform ) {

    var ballNode = this;
    this.ball = ball;
    this.modelViewTransform = modelViewTransform;

    Node.call( this, {renderer: 'svg', rendererOptions: {cssTransform: true}} );

    //  create the representation for a ball
    var ballRepresentation = new Circle( PlinkoConstants.BALL_RADIUS, {
      stroke: PlinkoConstants.BALL_COLOR,
      lineWidth: 2,
      fill: new RadialGradient( -PlinkoConstants.BALL_RADIUS * 0.4,
        -PlinkoConstants.BALL_RADIUS * 0.4,
        0,
        PlinkoConstants.BALL_RADIUS * 0.1,
        -PlinkoConstants.BALL_RADIUS * 0.3,
        PlinkoConstants.BALL_RADIUS * 0.6 )
        .addColorStop( 0, PlinkoConstants.BALL_HIGHLIGHT_COLOR )
        .addColorStop( 1, PlinkoConstants.BALL_COLOR ), centerX: 0, centerY: 0
    } );

    ballNode.addChild( ballRepresentation );

    ball.positionProperty.link( function( position ) {
      ballNode.center = modelViewTransform.modelToViewPosition( position );
    } );

  }

  return inherit( Node, BallNode, {
    update: function() {
      this.circle.center = this.modelViewTransform.modelToViewPosition( this.ball.position );
    }
  } );
} );