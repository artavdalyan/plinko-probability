// Copyright 2015, University of Colorado Boulder

/**
 * Scenery Node that displays three Radio Buttons that control the flow of Balls
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  var ballString = require( 'string!PLINKO_PROBABILITY/ball' );
  var noneString = require( 'string!PLINKO_PROBABILITY/none' );
  var pathString = require( 'string!PLINKO_PROBABILITY/path' );

  /**
   *
   * @param {Property.<string>} showRadioProperty - Valid values are 'ball', 'path', and 'none'.
   * @param {Object} [options]
   * @constructor
   */
  function BallRadioButtonsControl( showRadioProperty, options ) {

    Node.call( this );
    // Demonstrate a common pattern for specifying options and providing default values.
    options = _.extend( {
        spacing: 10, // vertical separation of the buttons
        padding: 3, // horizontal padding
        radius: 7, //radius of the circle of the Radio Button
        touchAreaXDilation: 5
      },
      options );

    // @private gives properties for text in panel for radio buttons
    var fontOptions = { font: PlinkoConstants.TEXT_FONT, maxWidth: 190 };

    //create the radio buttons 
    var showRadioButtons = new VerticalAquaRadioButtonGroup( [
      { node: new Text( ballString, fontOptions ), property: showRadioProperty, value: 'ball' },
      { node: new Text( pathString, fontOptions ), property: showRadioProperty, value: 'path' },
      { node: new Text( noneString, fontOptions ), property: showRadioProperty, value: 'none' }
    ], options );

    this.addChild( showRadioButtons );
  }

  plinkoProbability.register( 'BallRadioButtonsControl', BallRadioButtonsControl );

  return inherit( Node, BallRadioButtonsControl );
} );
