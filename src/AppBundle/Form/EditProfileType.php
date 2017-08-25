<?php
namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class EditProfileType extends AbstractType {
	public function buildForm(FormBuilderInterface $builder, array $options)
	{
		$builder
			->add('profile_realname', TextType::class, array(
				'required' => false
			))
			->add('profile_is_public', CheckboxType::class, array(
				'required' => false,
				'label' => 'Include me in player community'
			))
			->add('profile_display_email', CheckboxType::class, array(
				'required' => false,
				'label' => 'Allow logged-in users to see my E-mail address'
			))
			/*
			->add('geo_latitude', HiddenType::class, array(
				'required' => false
			))
			->add('geo_longitude', HiddenType::class, array(
				'required' => false
			))
			*/
			->add('profile_game_preferences', TextareaType::class, array(
				'required' => false,
				'label' => 'Game Preferences (battle or skirmish, number of players, optional rules)'
			))
			->add('profile_materials', TextareaType::class, array(
				'required' => false,
				'label' => 'Materials (do you have, need or can lend frames, dice, rulers, playmats?)'
			))
			->add('profile_experience', TextareaType::class, array(
				'required' => false,
				'label' => 'Experience (tactical skill, familiarity with rules)'
			))
			->add('save', SubmitType::class, array(
				'label' => 'Save Profile'
			))
		;
	}
}