// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for the 'Plinko Probability' lab screen.
 *
 * @author Martin Veillette (Berea College)
 * @author Guillermo Ramos (Berea College)
 * @author Denzell Barnett (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var BallsLayerNode = require( 'PLINKO_PROBABILITY/common/view/BallsLayerNode' );
  var BallRadioButtonsControl = require( 'PLINKO_PROBABILITY/lab/view/BallRadioButtonsControl' );
  var Board = require( 'PLINKO_PROBABILITY/common/view/Board' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dialog = require( 'JOIST/Dialog' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var GaltonBoardCanvasNode = require( 'PLINKO_PROBABILITY/common/view/GaltonBoardCanvasNode' );
  var HistogramNode = require( 'PLINKO_PROBABILITY/common/view/HistogramNode' );
  var Hopper = require( 'PLINKO_PROBABILITY/common/view/Hopper' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LabPlayPanel = require( 'PLINKO_PROBABILITY/lab/view/LabPlayPanel' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PegSoundGeneration = require( 'PLINKO_PROBABILITY/common/view/PegSoundGeneration' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PropertySet = require( 'AXON/PropertySet' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityCommonView = require('PLINKO_PROBABILITY/common/view/PlinkoProbabilityCommonView');
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SliderControlPanel = require( 'PLINKO_PROBABILITY/lab/view/SliderControlPanel' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StatisticsDisplayAccordionBox = require( 'PLINKO_PROBABILITY/lab/view/StatisticsDisplayAccordionBox' );
  var TrajectoryPath = require( 'PLINKO_PROBABILITY/lab/view/TrajectoryPath' );
  var VerticalRadioButtonCommon = require( 'PLINKO_PROBABILITY/common/view/VerticalRadioButtonCommon' );

  // images
  var counterDOMImage = require( 'image!PLINKO_PROBABILITY/counter.png' );
  var fractionDOMImage = require( 'image!PLINKO_PROBABILITY/fraction.png' );

  // strings
  var outOfBallsString = require( 'string!PLINKO_PROBABILITY/outOfBalls' );
  var HOPPER_TOP = 10;

  /**
   * @param {PlinkoProbabilityLabModel} model
   * @constructor
   */
  function PlinkoProbabilityLabView( model ) {

    PlinkoProbabilityCommonView.call(this, model);

    var thisModel = this;
    
    // the galton board is different in the lab tab and in the intro tab. They need different options passed
    var galtonBoardCanvasNode = new GaltonBoardCanvasNode( model.galtonBoard, model.numberOfRowsProperty, model.probabilityProperty, this.modelViewTransform, { canvasBounds: this.viewTriangularBoardBounds } );
    this.galtonBoardCanvasNode = galtonBoardCanvasNode;

    // create three radio buttons next to the hopper
    var ballRadioButtonsControl = new BallRadioButtonsControl( model.galtonBoardRadioButtonProperty );
    
    // create the two radio buttons that can toggle between 'fraction and 'counter' mode
    this.viewProperties.histogramRadioProperty.set('counter');
    var histogramRadioButtonsControl = new VerticalRadioButtonCommon( this.viewProperties.histogramRadioProperty, counterDOMImage, fractionDOMImage, 'counter', 'fraction', {
      buttonContentYMargin: 13
    } );
    
    // create an accordion box that displays sample and theoretical statistics related to the histogram
    var statisticsDisplayAccordionBox = new StatisticsDisplayAccordionBox(
      model,
      this.viewProperties.isTheoreticalHistogramVisibleProperty,
      this.viewProperties.expandedAccordionBoxProperty );
    
    // create play Panel
    var playPanel = new LabPlayPanel( model, model.ballModeProperty, { minWidth: statisticsDisplayAccordionBox.width } );
    
    // create slider panel that can modify properties of the galton board (number of rows and the binary probability)
    var sliderControlPanel = new SliderControlPanel( model.numberOfRowsProperty, model.probabilityProperty, { minWidth: statisticsDisplayAccordionBox.width } );
    
    
    var ballCanvasBounds = this.viewTriangularBoardBounds.dilated( 20 ); // bounds are slightly larger than the galton board itself
    // create the ballLayerNodes  (a canvas Node) that renders all the balls
    var ballsLayerNode = new BallsLayerNode( model.balls, this.modelViewTransform, model.numberOfRowsProperty, this.viewProperties.histogramRadioProperty, model.galtonBoardRadioButtonProperty,
      { canvasBounds: ballCanvasBounds } );
    this.ballsLayerNode = ballsLayerNode;
    
    // create pathsLayer to keep all the TrajectoryPath
    var pathsLayer = new Node( { layerSplit: true } );
    
    
    // handle the coming and going of the balls in the model.
    model.balls.addItemAddedListener( function( addedBall ) {
      switch( model.galtonBoardRadioButtonProperty.value ) {
        case 'ball':
          // initiates sound to play when ball hits a peg
          addedBall.on( 'playSound', function( direction ) {
            thisModel.pegSoundGeneration.playBallHittingPegSound( direction );
          } );
          model.balls.addItemRemovedListener( function removalListener( removedBall ) {
            if ( removedBall === addedBall ) {
              model.balls.removeItemRemovedListener( removalListener );
            }
          } );
          break;
        case 'path':
          var addedTrajectoryPath = new TrajectoryPath( addedBall, thisModel.modelViewTransform );
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
          throw new Error( 'Unhandled galton Board Radio Button state: ' + model.galtonBoardRadioButtonProperty.value );
      }
    } );
    
    
    // adding children to the scene graph
    this.addChild( histogramRadioButtonsControl );
    this.addChild( ballRadioButtonsControl );
    this.addChild( playPanel );
    this.addChild( sliderControlPanel );
    this.addChild( statisticsDisplayAccordionBox );
    this.addChild( galtonBoardCanvasNode );
    this.addChild( ballsLayerNode );
    this.moveChildToFront(this.histogramNode);
    this.addChild( pathsLayer );
    
    // layout the children
    histogramRadioButtonsControl.bottom = this.histogramRadioButtonsControlBottom;
    histogramRadioButtonsControl.left = this.histogramRadioButtonsControlLeft;
    playPanel.right = this.layoutBounds.maxX - 50;        // determines slider control panel and statistical display position
    playPanel.top = 10;
    ballRadioButtonsControl.left = this.hopperRight + 47;     // dependent on hopper position
    ballRadioButtonsControl.top = HOPPER_TOP;
    sliderControlPanel.top = playPanel.bottom + 10;
    sliderControlPanel.right = playPanel.right;
    statisticsDisplayAccordionBox.top = sliderControlPanel.bottom + 10;
    statisticsDisplayAccordionBox.right = playPanel.right;
    
    // no need to dispose of this link
    model.isBallCapReachedProperty.lazyLink( function( isBallCapReached ) {
      // pops up a dialog box when the number of balls is reached.
      if ( isBallCapReached ) {
        new Dialog( new MultiLineText( outOfBallsString, { font: new PhetFont( 50 ) } ), {
          modal: true,
          // focusable so it can be dismissed
          focusable: true
        } ).show();
        // sets the play button to active.
        playPanel.setPlayButtonVisible();
        // it is not playing anymore
        model.isPlayingProperty.set( false );
      }
    } );

  }

  plinkoProbability.register( 'PlinkoProbabilityLabView', PlinkoProbabilityLabView );

  return inherit( PlinkoProbabilityCommonView, PlinkoProbabilityLabView );
} );
