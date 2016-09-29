// Copyright 2014-2016, University of Colorado Boulder

/**
 * ScreenView for the 'Lab' screen
 *
 * @author Martin Veillette (Berea College)
 * @author Guillermo Ramos (Berea College)
 * @author Denzell Barnett (Berea College)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var HistogramModeControl = require( 'PLINKO_PROBABILITY/common/view/HistogramModeControl' );
  var HopperModeControl = require( 'PLINKO_PROBABILITY/lab/view/HopperModeControl' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LabPlayPanel = require( 'PLINKO_PROBABILITY/lab/view/LabPlayPanel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OutOfBallsDialog = require( 'PLINKO_PROBABILITY/lab/view/OutOfBallsDialog' );
  var PegControls = require( 'PLINKO_PROBABILITY/lab/view/PegControls' );
  var PegsNode = require( 'PLINKO_PROBABILITY/common/view/PegsNode' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityCommonView = require( 'PLINKO_PROBABILITY/common/view/PlinkoProbabilityCommonView' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var PlinkoProbabilityQueryParameters = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityQueryParameters' );
  var StatisticsAccordionBox = require( 'PLINKO_PROBABILITY/lab/view/StatisticsAccordionBox' );
  var TrajectoryPath = require( 'PLINKO_PROBABILITY/lab/view/TrajectoryPath' );

  // images
  var counterImage = require( 'image!PLINKO_PROBABILITY/counter.png' );
  var fractionImage = require( 'image!PLINKO_PROBABILITY/fraction.png' );

  // constants
  var PANEL_FIXED_WIDTH = 220; // determined empirically

  /**
   * @param {LabModel} model
   * @constructor
   */
  function LabScreenView( model ) {

    var self = this;

    PlinkoProbabilityCommonView.call( this, model, {
      histogramMode: 'counter'
    } );

    // pegs on the Galton board
    var pegsNode = new PegsNode( model.galtonBoard, model.numberOfRowsProperty, model.probabilityProperty, this.modelViewTransform, {
      canvasBounds: this.viewTriangularBoardBounds
    } );

    // radio buttons to right of the hopper
    var hopperModeControl = new HopperModeControl( model.hopperModeProperty, {
      left: this.hopper.right + 47,
      top: this.hopper.top
    } );

    // radio buttons that can toggle between 'fraction and 'counter' mode
    var histogramModeControl = new HistogramModeControl( this.viewProperties.histogramModeProperty, 'counter', counterImage, 'fraction', fractionImage, {
      bottom: this.eraserButton.top - 16,
      left: this.eraserButton.left
    } );

    // we call pre populate here because the histogram would be created by now
    if ( PlinkoProbabilityQueryParameters.POPULATE_HISTOGRAM ) {
      model.histogram.prepopulate( PlinkoProbabilityQueryParameters.POPULATE_HISTOGRAM );
    }

    // Play panel, at top right
    var playPanel = new LabPlayPanel( model, model.ballModeProperty, model.isBallCapReachedProperty, {
      minWidth: PANEL_FIXED_WIDTH,
      maxWidth: PANEL_FIXED_WIDTH,
      right: this.layoutBounds.maxX - PlinkoProbabilityConstants.PANEL_RIGHT_PADDING,
      top: 10
    } );

    // controls that modify the pegs in the galton board, below the Play panel
    var pegControls = new PegControls( model.numberOfRowsProperty, model.probabilityProperty, {
      minWidth: PANEL_FIXED_WIDTH,
      maxWidth: PANEL_FIXED_WIDTH,
      top: playPanel.bottom + PlinkoProbabilityConstants.PANEL_VERTICAL_SPACING,
      right: playPanel.right
    } );

    // statistics panel, below peg controls
    var statisticsAccordionBox = new StatisticsAccordionBox( model,
      this.viewProperties.isTheoreticalHistogramVisibleProperty,
      this.viewProperties.expandedAccordionBoxProperty, {
        minWidth: PANEL_FIXED_WIDTH,
        maxWidth: PANEL_FIXED_WIDTH,
        top: pegControls.bottom + PlinkoProbabilityConstants.PANEL_VERTICAL_SPACING,
        right: playPanel.right
      } );

    // create pathsLayer to keep all the TrajectoryPath
    var pathsLayer = new Node( { layerSplit: true } );

    // rendering order
    this.addChild( histogramModeControl );
    this.addChild( hopperModeControl );
    this.addChild( playPanel );
    this.addChild( pegControls );
    this.addChild( statisticsAccordionBox );
    this.addChild( pegsNode );
    this.addChild( pathsLayer );

    // handle the coming and going of the balls in the model.
    model.balls.addItemAddedListener( function( addedBall ) {
      switch( model.hopperModeProperty.get() ) {

        case 'ball':
          // initiates sound to play when ball hits a peg
          var ballHittingPegListener = function( direction ) {
            self.pegSoundGeneration.playBallHittingPegSound( direction );
          };
          addedBall.ballHittingPegEmitter.addListener( ballHittingPegListener );
          model.balls.addItemRemovedListener( function removalListener( removedBall ) {
            if ( removedBall === addedBall ) {
              addedBall.ballHittingPegEmitter.removeListener( ballHittingPegListener );
              model.balls.removeItemRemovedListener( removalListener );
            }
          } );
          break;

        case 'path':
          var addedTrajectoryPath = new TrajectoryPath( addedBall, self.modelViewTransform );
          pathsLayer.addChild( addedTrajectoryPath );
          model.balls.addItemRemovedListener( function removalListener( removedBall ) {
            if ( removedBall === addedBall ) {
              pathsLayer.removeChild( addedTrajectoryPath );
              model.balls.removeItemRemovedListener( removalListener );
            }
          } );
          break;

        case 'none':
          break;

        default:
          throw new Error( 'invalid hopperMode: ' + model.hopperModeProperty.get() );
      }
    } );

    // no need to dispose of this link
    model.isBallCapReachedProperty.lazyLink( function( isBallCapReached ) {

      // when the max number of balls is reached...
      if ( isBallCapReached ) {

        // pop up a dialog
        new OutOfBallsDialog().show();

        // sets the play button to active.
        playPanel.setPlayButtonVisible();

        // it is not playing anymore
        model.isPlayingProperty.set( false );
      }
    } );
  }

  plinkoProbability.register( 'LabScreenView', LabScreenView );

  return inherit( PlinkoProbabilityCommonView, LabScreenView );
} );

