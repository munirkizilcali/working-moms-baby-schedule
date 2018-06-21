class Api::V1::BabyUsersController < ApplicationController
	def index
		@baby_users = BabyUser.all
		render json: @baby_users
	end

	def create
		@baby_user = BabyUser.new(baby_user_params)
		if @baby_user.valid?
			@baby_user.save
			render json: @baby_user
		else
			render json: {status:'error', code:4000}
		end
	end

	def destroy
		@baby_user = BabyUser.find(params[:id])
		@baby_user.destroy
	end

	private

	def baby_user_params
		params.require(:baby_user).permit(:baby_id, :care_taker_id)
	end
end
