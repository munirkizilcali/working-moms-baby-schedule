class Api::V1::EventsController < ApplicationController
	def index
		if params[:user_id]
			@events = Event.where(user_id: params[:user_id])
		else
			@events = Event.all 
		end
		render json: @events
	end

	def show
		@event = Event.find(params[:id])
		render json: @event
	end


end
