Rails.application.routes.draw do
	namespace :api do 
    	namespace :v1 do 
		  resources :events
		  resources :baby_users
		  resources :babies do 
		  	resources :care_takers
		  end
		  resources :users do 
		  	resources :babies
		  	resources :events
		  end

		end
	end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
