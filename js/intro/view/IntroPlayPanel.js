// Copyright 2015, University of Colorado Boulder

/**
 * Scenery Node that represents a Panel with a Play Button and three radio buttons.
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var BallRepresentationNode = require( 'PLINKO_PROBABILITY/common/view/BallRepresentationNode' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PlayButton = require( 'PLINKO_PROBABILITY/intro/view/PlayButton' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  var allString = require( 'string!PLINKO_PROBABILITY/all' );
  var timesString = '\u00D7'; // multiplication Sign

  /**
   * Creation of play panel
   * @param {PlinkoProbabilityIntroModel} model
   * @param {Object} [options]
   * @constructor
   */
  function IntroPlayPanel( model, options ) {

    // Demonstrate a common pattern for specifying options and providing default values.
    options = _.extend( {
        xMargin: 7,
        yMargin: 15,
        stroke: 'black',
        lineWidth: 1,
        minWidth: 0.1,
        titleToControlsVerticalSpace: 5
      },
      options );

    var fontOptions = { font: PlinkoConstants.PANEL_FONT };

    // Creation of radio buttons
    var oneBall = new HBox( {
      spacing: PlinkoConstants.BALL_RADIUS,
      children: [ new BallRepresentationNode( 8 ), new Text( timesString + '1', fontOptions ) ]
    } );
    var tenBalls = new HBox( {
      spacing: PlinkoConstants.BALL_RADIUS,
      children: [ new BallRepresentationNode( 8 ), new Text( timesString + '10', fontOptions ) ]
    } );
    var allBalls = new HBox( {
      spacing: PlinkoConstants.BALL_RADIUS,
      children: [ new BallRepresentationNode( 8 ), new Text( timesString + allString, fontOptions ) ]
    } );

    var ballModeRadioButtons = new VerticalAquaRadioButtonGroup( [
      { node: oneBall, property: model.ballModeProperty, value: 'oneBall' },
      { node: tenBalls, property: model.ballModeProperty, value: 'tenBalls' },
      { node: allBalls, property: model.ballModeProperty, value: 'allBalls' }
    ], {
      radius: 8,      // radius of radio button circle
      spacing: 6,     // vertical spacing between each radio button
      touchAreaXDilation: 5
    } );


    //Creation of play button
    var playButton = new PlayButton( {
      listener: function() {
        model.trigger( 'PressPlayButton' );
      }
    } );

    //Creation of play button panel box
    var playAndRadioButtonBox = new HBox( {
      spacing: 0,
      children: [
        new HStrut( 15 ),     // spacing between left panel margin and play button
        playButton,
        new HStrut( 25 ),     // spacing between play button and radio buttons
        ballModeRadioButtons,
        new HStrut( 10 )      // spacing between radio buttons and right margin
      ]
    } );

    Panel.call( this, playAndRadioButtonBox, options );
  }

  plinkoProbability.register( 'IntroPlayPanel', IntroPlayPanel );

  return inherit( Panel, IntroPlayPanel );
} );