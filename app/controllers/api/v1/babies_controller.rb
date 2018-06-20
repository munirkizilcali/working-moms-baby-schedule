class Api::V1::BabiesController < ApplicationController
	def index
		if params[:user_id]
			@babies = Baby.where(mother_id: params[:user_id])
		else
			@babies = Baby.all 
		end
		render json: @babies
	end

	def show
		@baby = Baby.find(params[:id])
		render json: @baby
	end

	def create
		@baby = Baby.new(baby_params)
		if @baby.valid?
			@baby.save
			render json: @baby
		else
			render json: {status:'error', code:4000}
		end
	end

	private

	def baby_params
		params.require(:baby).permit(:mother_id, :name, :sex, :birth)
	end
end
