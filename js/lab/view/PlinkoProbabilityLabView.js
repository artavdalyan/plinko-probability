// Copyright 2002-2015, University of Colorado Boulder

/**
 * View for the 'Plinko Probability' lab screen.
 */
define( function( require ) {
  'use strict';

  // modules

  var BallNode = require( 'PLINKO/common/view/BallNode' );
  var BallRadioButtonsControl = require( 'PLINKO/lab/view/BallRadioButtonsControl' );
  var Board = require( 'PLINKO/common/view/Board' );
  var Bounds2 = require( 'DOT/Bounds2' );
  //var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Color = require( 'SCENERY/util/Color' );
  var CounterButton = require( 'PLINKO/common/view/CounterButton' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var FractionButton = require( 'PLINKO/common/view/FractionButton' );
  var GaltonBoardNode = require( 'PLINKO/common/view/GaltonBoardNode' );
  var HistogramNode = require( 'PLINKO/common/view/HistogramNode' );
  var Hopper = require( 'PLINKO/common/view/Hopper' );
  var HSlider = require( 'SUN/HSlider' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlayPanel = require( 'PLINKO/lab/view/PlayPanel' );
  //var PropertySet = require( 'AXON/PropertySet' );
  var Property = require( 'AXON/Property' );
  //var Range = require( 'DOT/Range' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SliderControlPanel = require( 'PLINKO/lab/view/SliderControlPanel' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StatisticsDisplayNode = require( 'PLINKO/common/view/StatisticsDisplayNode' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  // TODO: place used strings here

  // images
  var mockup02Image = require( 'image!PLINKO/mockupCropped02.png' );

  /**
   * @param {PlinkoProbabilityLabModel} model
   * @constructor
   */
  function PlinkoProbabilityLabView( model ) {

    var thisView = this;
    ScreenView.call( this, { renderer: 'svg', layoutBounds: new Bounds2( 0, 0, 1024, 618 ) } );

    var galtonBoardApexPosition = new Vector2( this.layoutBounds.maxX / 2 - 80, 70 );

    // create the hopper and the wooden Board
    var hopper = new Hopper();
    var board = new Board();

    hopper.centerX = galtonBoardApexPosition.x;
    hopper.top = 10;
    // TODO: find a way to take care of the shadow offset in a less ad hoc way
    board.centerX = hopper.centerX + 10;
    board.top = hopper.bottom + 10;

    var viewGraphBounds = board.getBounds();
    var modelGraphBounds = model.galtonBoard.bounds;
    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( modelGraphBounds, viewGraphBounds );

    var histogramNode = new HistogramNode(
      model.numberOfRowsProperty,
      new Property( false ),
      model,
      modelViewTransform );

    var galtonBoardNode = new GaltonBoardNode( model, modelViewTransform );

    //var histogramRadioProperty = new Property( 'fraction' ); //Valid values are 'fraction', 'number', and 'autoScale'.

    var showRadioProperty = new Property( 'ball' ); // Valid values are 'ball', 'path', and 'none'.

    var ballRadioProperty = new Property( 'oneBall' ); // Valid values are 'oneBall' and 'continuous'.

    ballRadioProperty.link( function( value ) {
      //do stuff
    } );

    var ballRadioButtonsControl = new BallRadioButtonsControl( showRadioProperty );

    // Add the counter button that allows the histogram
    var counterButton = new CounterButton( {
      minHeight: 40,
      xMargin: 3,
      minWidth: 40,
      iconWidth: 35,
      lineWidth: 2,
      stroke: 'black',
      cornerRadius: 10,
      listener: function() {
        // TODO hooked the listener;
      }
    } );

    // Add the fraction button that allows the histogram
    var fractionButton = new FractionButton( {
      minHeight: 40,
      xMargin: 3,
      minWidth: 40,
      iconWidth: 35,
      lineWidth: 2,
      stroke: 'black',
      cornerRadius: 10,
      listener: function() {
        // TODO hooked the listener;
      }
    } );

    // Add the eraser button that allows the
    var eraserButton = new EraserButton( {
      scale: 1.4,
      listener: function() {
        // TODO hooked the listener;
      }
    } );

    // Handle the comings and goings of balls
    var ballsLayer = new Node();

    model.balls.addItemAddedListener( function( addedBall ) {

      // Create and add the view representation for this dataBall.
      var addedBallNode = new BallNode( addedBall, model, modelViewTransform );
      ballsLayer.addChild( addedBallNode );

      // Add the removal listener for if and when this dataPoint is removed from the model.
      model.balls.addItemRemovedListener( function removalListener( removedBall ) {
        if ( removedBall === addedBall ) {
          ballsLayer.removeChild( addedBallNode );
          model.balls.removeItemRemovedListener( removalListener );
        }
      } );
    } );

    // create play Panel
    var playPanel = new PlayPanel( model.isPlayingProperty, ballRadioProperty );

    // create slider Panel
    var numberOfRowsForSliderProperty = new Property( 12 );

    numberOfRowsForSliderProperty.link( function( numberOfRowsForSlider ) {
      // ensure that the numberOfRows in the model is always an integer
      model.numberOfRows = Math.round( numberOfRowsForSlider );
    } );
    var sliderControlPanel = new SliderControlPanel( numberOfRowsForSliderProperty, model.probabilityProperty );

    // create Panel that displays sample and theoretical statistics
    var statisticsDisplayNode = new StatisticsDisplayNode( model );

    // create the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right:  thisView.layoutBounds.maxX - 10,
      bottom: thisView.layoutBounds.maxY - 10
    } );

    // Create the Sound Toggle Button in the bottom right
    var soundToggleButton = new SoundToggleButton( model.isSoundEnabledProperty, {
      right: resetAllButton.left - 20,
      centerY: resetAllButton.centerY
    } );

    //// create the hopper and the wooden Board
    //var hopper = new Hopper();
    //var board = new Board();

    this.addChild( hopper );
    this.addChild( board );
    this.addChild( eraserButton );
    this.addChild( fractionButton );
    this.addChild( counterButton );
    this.addChild( ballRadioButtonsControl );
    this.addChild( soundToggleButton );
    this.addChild( resetAllButton );
    this.addChild( playPanel );
    this.addChild( sliderControlPanel );
    this.addChild( statisticsDisplayNode );
    this.addChild( galtonBoardNode );
    this.addChild( histogramNode );
    this.addChild( ballsLayer );

    eraserButton.bottom = this.layoutBounds.maxY - 40;
    eraserButton.left = 40;
    fractionButton.bottom = eraserButton.top - 10;
    fractionButton.left = eraserButton.left;
    counterButton.bottom = fractionButton.top - 10;
    counterButton.left = eraserButton.left;
    ballRadioButtonsControl.left = hopper.right + 20;
    ballRadioButtonsControl.top = hopper.top;
    playPanel.right = this.layoutBounds.maxX - 40;
    playPanel.top = 10;
    sliderControlPanel.top = playPanel.bottom + 10;
    sliderControlPanel.right = playPanel.right;
    statisticsDisplayNode.top = sliderControlPanel.bottom + 10;
    statisticsDisplayNode.right = playPanel.right;
    // galtonBoardNode.centerX=hopper.centerX;
    // altonBoardNode.top=board.top+20;

    //TODO: Delete when done with the layout
    ////////////////////////////////////////////////////////////////
    //Show the mock-up and a slider to change its transparency
    //////////////////////////////////////////////////////////////

    var mockup02OpacityProperty = new Property( 0.02 );

    var image02 = new Image( mockup02Image, { pickable: false } );

    image02.scale( this.layoutBounds.height / image02.height );

    mockup02OpacityProperty.linkAttribute( image02, 'opacity' );

    this.addChild( image02 );

    this.addChild( new HSlider( mockup02OpacityProperty, { min: 0, max: 1 }, { top: 100, left: 20 } ) );

    /////////////////////////////////////////////////////////////////////////
  }

  return inherit( ScreenView, PlinkoProbabilityLabView, {
    step: function( dt ) {
    }
  } );
} );
