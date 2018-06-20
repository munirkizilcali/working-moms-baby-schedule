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

	def create
		@event = Event.new(event_params)
		if @event.valid?
			@event.save
			render json: @event
		else
			render json: {status:'error', code:4000}
		end
	end

	def destroy

		@event = Event.find(params[:id])
		@event.destroy
	end

	private

	def event_params
		params.require(:event).permit(:baby_id, :user_id, :amount_1, :amount_2, :notes, :created_at, :updated_at, :type, :bottle_id, :event_time)
	end


end
