var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    // your code here
    this.set('like', !this.get('like'));
    this.collection.sortByField('like');
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {

    this.on('change:like', function(e) {
      this.sortByField('like')
    });
  },

  comparator: 'title',

  sortByField: function(field) {
    this.comparator = field;
    this.sort(this.comparator);
  }

});

var AppView = Backbone.View.extend({


  events: {
    'click form input': 'handleClick'
  },
  
  initialize: function() {
    this.collection.on('change:collection', function(e) {
      this.model.render();
    });

  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);    
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    // your code here
      this.model.on('change:like', function() {
      this.render();
    }, this);
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function(e) {
    // your code herec
    this.model.toggleLike();
    this.render();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {

    this.collection.on('sort', function() { 
      this.render();
    }, this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
