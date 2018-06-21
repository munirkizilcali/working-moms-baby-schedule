class Baby < ApplicationRecord
	belongs_to :mother, class_name: 'User'
	has_many :events, dependent: :destroy
	has_many :baby_users, dependent: :destroy
	has_many :care_takers, through: :baby_users
	after_create :add_mother_to_care_takers

	validates_associated :mother
	validates :name, :sex, :birth, presence: true

	
	private 
	
	def add_mother_to_care_takers
		self.care_takers << User.find(self.mother_id)
	end


end
