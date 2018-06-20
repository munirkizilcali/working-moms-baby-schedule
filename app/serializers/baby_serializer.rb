class BabySerializer < ActiveModel::Serializer
  attributes :id, :name, :sex, :birth, :mother_id, :created_at, :updated_at

  belongs_to :mother, class_name: 'User'

  has_many :care_takers
  has_many :events
end
