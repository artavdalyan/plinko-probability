// Copyright 2015, University of Colorado Boulder

/**
 * A Scenery node that depicts a wooden triangular board.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Board( options ) {

    Node.call( this );

    options = _.extend( {
      // defaults
      height: 300,
      bottomWidth: 600,
      shadowFill: 'rgb(136,136,136)'
    }, options );

    // @public (read-only)
    this.options= options;

    // create the triangular shape of the board
    var boardShape = new Shape().moveTo( 0, 0 )
      .lineTo( options.bottomWidth / 2, options.height )
      .lineTo( -options.bottomWidth / 2, options.height )
      .close();

    // create the gradient on face of Galton Board
    var boardRectangleGradient = new LinearGradient( -options.bottomWidth / 2, 0, options.bottomWidth / 2, 0 ).addColorStop( 0.0112, '#FBEFD0' ).addColorStop( 0.1742, '#FADBA2' ).addColorStop( 0.2978, '#FAE3B0' ).addColorStop( 0.5393, '#E8CFA1' ).addColorStop( 0.6573, '#F0D3A1' ).addColorStop( 0.7809, '#FBEED2' ).addColorStop( 0.9607, '#F9E2BA' );
    var boardPath = new Path( boardShape, { fill: boardRectangleGradient, centerX: 0, top: 0 } );
    this.addChild( boardPath );

    // produces the bottom dropped shadow on the Galton Board
    var boardShadowRectangleGradient = new LinearGradient( options.bottomWidth / 2, options.height, options.bottomWidth / 2, options.height + 10 ).addColorStop( 0.00, options.shadowFill ).addColorStop( 0.20, options.shadowFill ).addColorStop( 1.00, PlinkoConstants.BACKGROUND_COLOR );
    var horizontalRectangle = new Rectangle( boardPath.left + 4, boardPath.bottom, boardPath.width + 8, 10, 5, 50, { fill: boardShadowRectangleGradient } );
    this.addChild( horizontalRectangle );

    // create the dropped shadow to the right of the galton board
    var slantedShadowShape = new Shape().moveTo( 4, 4 )
      .lineToRelative( options.bottomWidth / 2, options.height )
      .lineToRelative( 10, 0 )
      .lineToRelative( -options.bottomWidth / 2, -options.height )
      .close();
    var boardSlantedGradient = new LinearGradient( options.bottomWidth / 4, options.height / 2, options.bottomWidth / 4 + 5, options.height / 2 - 5 ).addColorStop( 0.00, options.shadowFill ).addColorStop( 0.20, options.shadowFill ).addColorStop( 1.00, PlinkoConstants.BACKGROUND_COLOR );
    var slantedShadowPath = new Path( slantedShadowShape, { fill: boardSlantedGradient } );

    this.addChild( slantedShadowPath );


    // Pass options through to the parent class.
    this.mutate( options );
  }

  plinkoProbability.register( 'Board', Board );

  return inherit( Node, Board );
} );